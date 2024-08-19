import React, { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import { getAddedSlots , deleteTableTimeSlot } from "../../services/SellerApiClient";
import SlotAddModal from "./shared/SlotAddModal";
import toast from "react-hot-toast";


interface tableSlots {
    _id :string;
    slotDate : string;
    slotStartTime : string;
    slotEndTime : string;
}
const AddTableSlots : React.FC = () => {
  const [tableDatas, setTableDatas] = useState<tableSlots[]>([]);
  const {tableId} = useParams(); 
  const fetchTableData = async () => {
      try {
        if(tableId){
        const res = await getAddedSlots(tableId);
        console.log(res.data.tableSlotDatas)
        setTableDatas(res.data.tableSlotDatas);
        }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  const handleDelete = async (tableId : string)=>{
    console.log("hhjhj")
    const {data} = await deleteTableTimeSlot(tableId);
    toast.success(data.message)
    fetchTableData();
  };
  return (    
    <div className="h-full mt-32 ">
      <div className="pt-10 flex  justify-between">
        <h1 className="text-xl font-bold ">Table Slots</h1>
        <SlotAddModal MountAfterUpdate={fetchTableData} tableId={tableId}  />
      </div>
      <div className="overflow-x-auto shadow-sm shadow-orange-200  mt-14">
        <table className="table">
          <thead>
            <tr className="font-bold text-sm text-red-500">
              <th>SL NO</th>
              <th>Time</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {tableDatas && tableDatas.length > 0 ? (
            tableDatas.map((data: tableSlots, index: number) => {
              return (
                <tbody>
                  <tr className=" border-red-500 font-bold text-gray-500 text-base" key={index}>
                    <td className="text-black font-semibold">{index + 1}</td>
                    <td className="text-black font-semibold">{data.slotStartTime} - {data.slotEndTime}</td>
                    <td className="text-black font-semibold">{data.slotDate.split('T')[0]}</td>
                    <th>
                    
                      <button className="btn btn-primary bg-red-500 btn-sm text-white hover:bg-red-600"
                      onClick={()=>handleDelete(data._id)}>
                         delete
                      </button>
                   
                    </th>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <div />
          )}
        </table>
      </div>
      {tableDatas && tableDatas.length < 1 && (
        <div className="text-xl font-bold flex justify-center p-10">
          No Slots available
        </div>
      )}
    </div>
  );
};

export default AddTableSlots;
