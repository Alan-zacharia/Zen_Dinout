/** Modules import */
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

/** Folders import */
import configuredKeys from "./configs/envConfig";
import routes from "./application/routes/routes";
import databaseConnection from "./configs/databaseConfig";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: configuredKeys.CLIENT_URL }));
app.use(cookieParser());

databaseConnection();
routes(app);

app.listen(configuredKeys.PORT, () => {
  console.log("Server is running on http://localhost:" + configuredKeys.PORT);
});
