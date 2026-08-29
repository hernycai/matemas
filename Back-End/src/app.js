import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CARGAR ENV ANTES QUE CUALQUIER OTRO IMPORT (Evita el hoisting de ESM)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});

import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes.js";
import prisma from "./config/prisma.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3001;

// BUG-033: no filtrar fingerprint del stack
app.disable("x-powered-by");

const allowedOrigins = [
  "https://matemas.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : []),
];

app.use(
  cors({
    origin(origin, callback) {
      // Permitir tools sin Origin (curl, healthchecks) y orígenes whitelisteados
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const isGeminiMissing =
  !process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "api_key";

if (isGeminiMissing) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Atención: faltan las Keys de permiso y GeminiCli no va a dar las respuestas automatizadas, agregar una API Key GRATUITA desde tu cuenta de Google en Google Studio.",
  );
}

app.use(express.json());

app.use("/api", apiRoutes);
app.use(errorHandler);

app.get("/", (req, res) =>
  res.status(200).send("InnovaLab API Core - Back-End Online"),
);

if (process.env.NODE_ENV !== "production") {
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `El puerto ${PORT} ya está en uso. Intentá con otro o matá el proceso anterior.`,
      );
      process.exit(1);
    } else {
      console.error("Error al iniciar el servidor:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
