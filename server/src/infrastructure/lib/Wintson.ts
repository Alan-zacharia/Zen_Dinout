import * as wintson from "winston";

const logger = wintson.createLogger({
  transports: [
    new wintson.transports.Console(),
    new wintson.transports.File({ filename: "error.log", level: "error" }),
    new wintson.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
