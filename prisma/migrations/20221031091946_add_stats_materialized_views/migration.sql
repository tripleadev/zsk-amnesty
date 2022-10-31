CREATE MATERIALIZED VIEW "BasicStats" AS SELECT
    (SELECT COUNT(*) FROM public."Author") as "totalAuthors",
    (SELECT COUNT(*) FROM public."Letter") as "totalLetters",
    (SELECT COUNT(*) FROM public."Destination") as "totalDestinations",
    (SELECT COUNT(*) FROM (SELECT COUNT(*) FROM public."Author" as author GROUP BY author."classId") as classes) as "totalClasses";

CREATE MATERIALIZED VIEW "LettersByClass" AS
    SELECT
        COUNT(*) AS "lettersCount",
        author."classId" as "classId"
    FROM "Author" as author JOIN "Letter" as letter
        ON author.id=letter."authorId"
    GROUP BY author."classId";

CREATE MATERIALIZED VIEW "LettersByDestination" AS
    SELECT
        COUNT(*) AS "lettersCount",
        dest.id as "destinationId"
    FROM "Destination" as dest JOIN "Letter" as letter
        ON dest.id=letter."destinationId"
    GROUP BY dest.id;

CREATE MATERIALIZED VIEW "AnonymousLettersByDestination" AS
    SELECT
        COUNT(*) AS "anonymousLettersCount",
        dest.id as "destinationId"
    FROM "Destination" as dest
        JOIN "Letter" as letter
            ON dest.id=letter."destinationId"
        JOIN "Author" as author
            ON letter."authorId"=author.id
    WHERE author."classId" LIKE 'Public'
    GROUP BY dest.id;
