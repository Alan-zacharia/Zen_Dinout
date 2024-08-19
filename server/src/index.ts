/** Modules import */
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/** Folders import */
import configuredKeys from "./configs/config";
import routes from "./application/routes/routes";
import databaseConnection from "./configs/databaseConfig";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:4000" }));
app.use(cookieParser());

databaseConnection();
routes(app);

app.listen(configuredKeys.PORT, () => {
  console.log("Server is running on http://localhost:" + configuredKeys.PORT);
});
