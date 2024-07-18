const omit = (obj: Object, arr: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));

export { omit };
