export const invertKeyValues = (
  obj: Record<string, any>
): Record<string, any> =>
  Object.fromEntries(Object.entries(obj).map((entry) => entry.reverse()));
