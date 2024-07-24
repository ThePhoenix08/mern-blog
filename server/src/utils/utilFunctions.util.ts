/** Omit or remove specified keys from an object */
const omit = (arg: any, arr: string[]) => {
  const obj = typeof arg === "object" ? arg : arg.toObject();

  Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));

  return obj;
};

export { omit };
