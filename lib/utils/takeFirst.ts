export const takeFirst = <T>(p: Promise<Array<T>>): Promise<T> => p.then((a) => a[0]);
