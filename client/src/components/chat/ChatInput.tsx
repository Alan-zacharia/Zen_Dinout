import React, { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axiosInstance from "../../api/axios";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { id } = useSelector((state: RootState) => state.user);
   const handleSubmit = (e : FormEvent)=>{
     e.preventDefault();
     if(!message) return;
     axiosInstance.post("/api/inbox/sendMessage",{
       
     }).then((res)=>{
       console.log(res)
     }).catch(({response})=>{
      console.log(response);
     })
   }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center p-3 bg-white border-t border-gray-200">
        <input
          placeholder="Message..."
          className="flex-1 p-3 border border-gray-400 shadow-lg rounded-full bg-light outline-none pr-16"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="absolute right-8 text-orange-500" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
