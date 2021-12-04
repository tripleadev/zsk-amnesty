export const extractFilters = (stats: object, match: string) => {
  return Object.keys(stats).filter((key) => key.startsWith(match));
};
