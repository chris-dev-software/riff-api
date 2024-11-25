import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import scheduleRoutes from "./routes/schedule.routes";
import attendanceRoutes from "./routes/attendance.routes";
import documentRoutes from "./routes/document.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/attendances", attendanceRoutes);
app.use("/documents", documentRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
