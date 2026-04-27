
import NodeCache from "node-cache";

const cache = new NodeCache();

export const nodeSet = (
  key: string,
  value: any,
  ttl: number = 600
): boolean => {
  return cache.set(key, value, ttl); 
};

export const nodeGet = (key: string): any => {
  return cache.get(key);
};

export const nodeDelete = (key: string): number => {
  return cache.del(key);
};

