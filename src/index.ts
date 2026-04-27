import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/connectDB";
import hpp from "hpp";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(" Client connected:", socket.id);

  socket.on("message", (msg) => {
    console.log(" Message received:", msg);

    socket.emit("reply", `Received your message: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});


app.use(helmet());
app.use(hpp());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

app.use(
  cors({
    origin: "https://yourdomain.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // console
} else {
  // production
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

app.get("/api/isAppBlocked", (req, res) => {
  res.json({ isBlocked: true }); 
});
// ************************************************************************************************************* 
app.use(express.json());

import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import courseRoutes from "./routes/course.route";
import AuthUser from "./routes/Auth.routes";
import enrollments from "./routes/Enrollment.routes";
import Lesson from "./routes/Lesson.routes";
import paymentRoutes from "./routes/PaymentRoutes";
import comment from "./routes/commentRoutes";
import Evaluation from "./routes/EvaluationRoutes";
import Dashboard from "./routes/AdminRoutes";
import aiRoutes from "./routes/ai";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/auth", AuthUser);
app.use("/api/v1/enrollments", enrollments);
app.use("/api/v1/lesson", Lesson);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/comment", comment);
app.use("/api/v1/evaluation", Evaluation);
app.use("/api/v1/admin", Dashboard);
app.use("/api/v1/ai", aiRoutes);

sequelize
  .authenticate()
  .then(() => console.log(" Connected to DB successfully."))
  .catch((err: Error) => console.error(" DB Connection Error:", err.message));

sequelize.sync().then(() => {
  console.log(" All models synced with DB!");
});

httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
