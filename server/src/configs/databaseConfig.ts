import mongoose from "mongoose";
import configuredKeys from "./envConfig";

const databaseConnection = async () => {
  try {
    await mongoose.connect(configuredKeys.DB_HOST,
      {
        serverSelectionTimeoutMS: 8000 
      }
    );
    console.log("Database connected succefully......");
  } catch (err) {
    console.log(`Error in database connection ---> ${err} `);
  }
};
  
export default databaseConnection;
        