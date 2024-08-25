import React from "react";
import Form from "../layouts/Form";

const Menu: React.FC = () => {
  return (
    <div className="pt-14">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold ">Menu</h1>
        <div className="flex justify-end ">
          <Form />
        </div>
      </div>
      <h1 className="text-2xl font-bold p-20"> No menu Found</h1>
    </div>
  );
};

export default Menu;
