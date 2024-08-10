/** Omit or remove specified keys from an object */
const omit = (arg: any, arr: string[]): Record<string, any> => {
  const obj = typeof arg === "object" ? arg : arg.toObject();
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !arr.includes(k))
  );
};

export { omit };
