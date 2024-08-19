import React from "react";
interface PropsPassing{
  title : string,
  classN : string | '',
}
const Button : React.FC<PropsPassing> = (props) => {
  return (
    <div>
      <button className={props.classN ? `px-6 py-1 border-2 border-orange-500  text-orange-500 hover:text-white hover:bg-orange-700 transition-all rounded-full ${props.classN}` : "px-6 py-1 border-2 border-orange-500 text-orange-500 hover:text-white hover:bg-orange-700 transition-all rounded-full " }>{props.title}</button>
    </div>
  );
};

export default Button;
