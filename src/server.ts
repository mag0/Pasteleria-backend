import express from "express";
import 'dotenv/config';
import cors from "cors";
import routerProduct from "./Routers/routerProduct";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import path from "path";

connectDB();

const app = express();

app.use(cors(corsConfig));

// Leer datos de formularios
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "public", "uploads")));

app.use('/', routerProduct);

export default app