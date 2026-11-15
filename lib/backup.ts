import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

// One CSV holds all three tables; the `table` column says which one a row belongs to.
const COLUMNS = [
  "table",
  "id",
  "createdAt",
  "name",
  "classId",
  "registerNumber",
  "destinationId",
  "authorId",
] as const;
type Row = Record<typeof COLUMNS[number], string>;

const STATS_VIEWS = [
  "AnonymousLettersByDestination",
  "BasicStats",
  "LettersByClass",
  "LettersByDestination",
];

const TX_OPTIONS = { timeout: 60_000, maxWait: 10_000 };

const escapeCsv = (value: string) =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export const toCsv = (rows: Partial<Row>[]) =>
  // BOM so Excel reads Polish characters correctly
  "﻿" +
  [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((c) => escapeCsv(r[c] ?? "")).join(","))].join(
    "\n",
  );

export const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") field += ch;
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const exportCsv = async (db: Prisma.TransactionClient) => {
  const destinations = await db.destination.findMany();
  const authors = await db.author.findMany();
  const letters = await db.letter.findMany({ orderBy: { createdAt: "asc" } });

  return toCsv([
    ...destinations.map((d) => ({ table: "Destination", id: d.id, name: d.name })),
    ...authors.map((a) => ({
      table: "Author",
      id: a.id,
      classId: a.classId,
      registerNumber: a.registerNumber?.toString(),
    })),
    ...letters.map((l) => ({
      table: "Letter",
      id: l.id,
      createdAt: l.createdAt.toISOString(),
      destinationId: l.destinationId,
      authorId: l.authorId,
    })),
  ]);
};

const wipe = async (db: Prisma.TransactionClient) => {
  await db.letter.deleteMany();
  await db.author.deleteMany();
  await db.destination.deleteMany();
};

// The stats triggers only fire on INSERT/UPDATE, so refresh explicitly after deletes.
const refreshStatsViews = async (db: Prisma.TransactionClient) => {
  for (const view of STATS_VIEWS) {
    await db.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW "${view}"`);
  }
};

export const getBackupCsv = () => prisma.$transaction(exportCsv, TX_OPTIONS);

/** Exports everything and wipes it in one transaction, so a reset never happens without a backup. */
export const resetDatabase = () =>
  prisma.$transaction(async (tx) => {
    const csv = await exportCsv(tx);
    await wipe(tx);
    await refreshStatsViews(tx);
    return csv;
  }, TX_OPTIONS);

/** Replaces letters, authors and destinations with the contents of a backup CSV. */
export const restoreDatabase = async (csv: string) => {
  const [header, ...lines] = parseCsv(csv.replace(/^﻿/, ""));

  if (header?.join(",") !== COLUMNS.join(",")) {
    throw new Error("Invalid backup file");
  }

  const rows = lines
    .filter((l) => l.length > 1)
    .map((l) => Object.fromEntries(COLUMNS.map((c, i) => [c, l[i] ?? ""])) as Row);
  const ofTable = (table: string) => rows.filter((r) => r.table === table);

  const authors = ofTable("Author").map((r) => ({
    id: r.id,
    classId: r.classId,
    registerNumber: r.registerNumber ? Number(r.registerNumber) : null,
  }));
  const letters = ofTable("Letter").map((r) => ({
    id: r.id,
    createdAt: new Date(r.createdAt),
    destinationId: r.destinationId,
    authorId: r.authorId,
  }));

  if (
    authors.some((a) => a.registerNumber !== null && !Number.isInteger(a.registerNumber)) ||
    letters.some((l) => isNaN(l.createdAt.getTime()))
  ) {
    throw new Error("Invalid backup file");
  }

  await prisma.$transaction(async (tx) => {
    await wipe(tx);
    await tx.destination.createMany({
      data: ofTable("Destination").map((r) => ({ id: r.id, name: r.name })),
    });
    await tx.author.createMany({ data: authors });
    await tx.letter.createMany({ data: letters });
    await refreshStatsViews(tx);
  }, TX_OPTIONS);

  return {
    destinations: ofTable("Destination").length,
    authors: authors.length,
    letters: letters.length,
  };
};
