import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";
import { towerDatabase } from "./database/databaseConnection";
import sdkRoutes from "./routes/service_routes";
import { portalKeyMiddleware } from "./middleware/portalKey";

dotenv.config();

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));

app.use("/portal", portalKeyMiddleware, sdkRoutes);

async function startTowerService() {
  try {
    await towerDatabase.sync();
    console.log("TOWER Database is ready!");

    app.listen(PORT, () => {
      console.log(`TOWER SERVER is active on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startTowerService();
