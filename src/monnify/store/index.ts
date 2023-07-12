const monnifyStore = new Map<string, any>();

export const setMonifyStore = (key: string, value: any) => {
  monnifyStore.set(key, value);
};

export const getMonifyStore = (key: string) => {
  return monnifyStore.get(key);
};

export const deleteMonifyStore = (key: string) => {
  monnifyStore.delete(key);
};
