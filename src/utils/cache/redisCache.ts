import redisClient from "./redisClient";

export const redisSet = async (key: string, value: any, ttl: number = 600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

export const redisGet = async (key: string): Promise<any | null> => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const redisDelete = async (key: string): Promise<void> => {
  await redisClient.del(key);
};
