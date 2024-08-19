import axios from '../../api/axios';
import React, { ChangeEvent, useEffect ,  useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {toast , Toaster} from "react-hot-toast";
const RestaurantApprovalForm = () => {
  const navigate = useNavigate();
  const [restaurantDetails , setRestautrantDetails] = useState<{restaurantName : string ; email :string ; contact : string}>();
  const [rejectReason , setRejectReason] = useState<string | null>(null);
  const { id } = useParams<{id : string}>();
  useEffect(()=>{
  const fetchData = async()=>{
   
     await axios.get(`/admin/restaurant-approval/${id}`).then((res)=>{ 
      setRestautrantDetails(res.data.restaurants);
     }).catch((error)=>{ 
      console.log(error);  
     });
     
   
  }
  fetchData();
  },[]);
  const hanldeRejectionReason = (e : ChangeEvent<HTMLTextAreaElement>) =>{
    const value = e.target.value;
    setRejectReason(value);
  }
  const handleApprove = async(logic : string)=>{
    if(logic == 'reject' ){
      if(!rejectReason || rejectReason.length < 10){
        toast.error("Please fill the reason....");
        return 
      }
    }  
     await axios.put(`/admin/restaurant-approval/${id}`,{logic , rejectReason}).then((response)=>{
      if(logic == "approve"){
        toast.success("Approved success.....")
      }else{
        toast.error("Rejected success.....")
      }
      setTimeout(()=>{
        navigate('/admin/restaurants');
      },2000)
     }).catch((error)=>{
      console.log(error);  
     })
  };
 
  return (
    <div className='flex p-20 items-center h-full'>
      <Toaster position='top-center'/>
      <div className='w-full max-w-[900px] bg-white shadow-2xl shadow-neutral-500 rounded-3xl flex flex-col lg:flex-row lg:p-10 justify-between'>
        {restaurantDetails && (
        <div className='flex flex-col gap-5 '>
          <p className='text-base font-semibold text-black '>Restaurant Name&ensp;: <span className='text-blue-500'>{restaurantDetails.restaurantName}</span></p>
          <p className='text-base font-semibold text-black '>Email Address&ensp;&ensp;&ensp;&ensp;:  <span className='text-blue-500'>{restaurantDetails.email}</span></p>
          <p className='text-base font-semibold text-black '>Contact number&ensp;&ensp;: <span className='text-blue-500'>{restaurantDetails.contact}</span></p>
        </div>

        )}
   
        <div className='flex flex-col items-center  gap-5'>
          <button className='text-white bg-green-500 p-2 rounded-full px-10 font-bold text-base hover:bg-green-600 mb-5 lg:mb-0' onClick={()=>handleApprove("approve")}>Approve</button>
          <div className="w-full lg:w-[400px] bg-black/60 h-[1px] my-5 lg:my-0"></div>
          <textarea className='bg-rose-200 w-full lg:w-[400px] h-[200px] mb-5 outline-none p-5 text-black font-semibold lg:mb-0 rounded-3xl placeholder:text-black' placeholder='Reason for rejecting ?' onChange={hanldeRejectionReason}/>
          <button className='text-white bg-red-500 p-2 rounded-full px-10 font-bold text-base  hover:bg-red-700' onClick={()=>handleApprove("reject")}>Reject</button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantApprovalForm
