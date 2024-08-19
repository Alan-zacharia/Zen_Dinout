import mongoose from "mongoose";
import configuredKeys from "./config";

const databaseConnection = async () => {
  try {
    await mongoose.connect(configuredKeys.DB_HOST);
    console.log("Database connected succefully.............");
  } catch (error) {
    console.log(
      "Oops something went wrong in database connection ! --->",
      error
    );
  }
};

export default databaseConnection;
