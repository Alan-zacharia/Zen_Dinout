/** Modules import */
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {createServer} from "http";
import { Server } from "socket.io";

/** Folders import */
import configuredKeys from "./configs/envConfig";
import routes from "./application/routes/routes";
import databaseConnection from "./configs/databaseConfig";
import socketConfig from "./configs/socketConfig";
import { membershipCronJob } from "./infrastructure/cron/jobs/membershipReminder";


const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer , {
  cors :{
    origin : configuredKeys.CLIENT_URL,
    methods : ["GET", "POST" ],
    credentials : true
  }
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: configuredKeys.CLIENT_URL }));
app.use(cookieParser());

socketConfig(io);
databaseConnection();
routes(app);

membershipCronJob()

app.listen(configuredKeys.PORT, () => {
  console.log("Server is running on http://localhost:" + configuredKeys.PORT);
});
 