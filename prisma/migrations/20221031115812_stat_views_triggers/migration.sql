CREATE OR REPLACE FUNCTION refresh_stats_views() RETURNS trigger AS
$$
BEGIN
  REFRESH MATERIALIZED VIEW public."AnonymousLettersByDestination";
  REFRESH MATERIALIZED VIEW public."BasicStats";
  REFRESH MATERIALIZED VIEW public."LettersByClass";
  REFRESH MATERIALIZED VIEW public."LettersByDestination";

  RETURN NULL;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER refresh_stats_views_letter_trigger
  AFTER INSERT OR UPDATE
  ON public."Letter"
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_stats_views();

CREATE OR REPLACE TRIGGER refresh_stats_views_author_trigger
  AFTER INSERT OR UPDATE
  ON public."Author"
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_stats_views();

CREATE OR REPLACE TRIGGER refresh_stats_views_destination_trigger
  AFTER INSERT OR UPDATE
  ON public."Destination"
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_stats_views();
