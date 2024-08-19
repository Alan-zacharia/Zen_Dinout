import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col ">
      {" "}
      <h4 className="text-lg font-bold">
        <span className="text-black">Zen</span>
        <span className="text-orange-500"> Dinout</span>
      </h4>
      <span className="loading loading-dots loading-lg text-4xl text-blue-500"></span>
    </div>
  );
};

export default Loading;
