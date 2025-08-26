import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
  )
);

const logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join("logs", "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;

// import logger from "../utils/logger";

// استخدامات ممكنة:
// logger.info("User logged in: " + user.id);
// logger.error("Failed to connect to DB");
// logger.warn("Disk space is low");

// سجل بقا الحاجات دي ف جزء من مشروعك
