import React from "react";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" />
      <AppRouter />
    </>
  );
};

export default App;
