DROP VIEW "TopAuthors";

CREATE VIEW "TopAuthors" AS
  SELECT
    author.id as "authorId",
    author."registerNumber" as "registerNumber",
    author."classId" as "classId",
    COUNT(letter.id) as "letters"
  FROM public."Author" as author
  JOIN public."Letter" AS letter ON author.id=letter."authorId"
  WHERE author."registerNumber" IS NOT NULL
  GROUP BY author.id
  ORDER BY COUNT(letter.id) DESC;
