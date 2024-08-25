import axios from "../api/axios";
import { tableSlotTypes } from "../types/restaurantTypes";

export interface credentials {
  restaurantName: string;
  email: string;
  contact: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  TableRate: string;
  featuredImage: string;
  secondaryImages: string;
}

export const sellerRegisteration = async (datas : credentials , restaurantId : string )=>{
     try{
       const {data : {  message}} = await axios.put('/restaurant/restaurant-updation',{datas , restaurantId});
       return {data :{ message}}
      } catch (error) {
        console.log(error);
        throw error;
      }
}

export const validateToken = async () => {
    const response = await axios.get("/restaurant/validate-token");
    console.log(response.data); 
    if (response.status !== 200) {
      throw new Error("Token invalid");
    }
    return response;
  }; 

export const Logout = async () => {
  const response = await axios.post("/restaurant/logout");
  if (response.status !== 200) {
    throw new Error("Error during sign out...");
  }
  };


export const imageCloudUpload = async (Image : string) =>{
     const formData = new FormData();
      formData.append("file", Image);
      formData.append("upload_preset", "xkitcf7p");
      try {
        console.log(formData);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dneezqmgu/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        if (res.ok) {
          const data = await res.json();
          return data.secure_url
        } else {
          console.error("Upload failed:", res.statusText);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }   
}

export const sellerLogin = async (data: Partial<credentials>) => {
  try {
    const {
      data: { message, user, token },
    } = await axios.post("/restaurant/login", data);
    return { data: { message, user, token } };
  } catch (error) {
    console.log(error); 
    throw error;
  }
};


export const tablesSlotCreationApi = async(tableAddingDatas : tableSlotTypes , restaurantId : string)=>{
  try{
    console.log(tableAddingDatas)
    const {data : {message , status , newTableSlot}} = await axios.post("/restaurant/add-table" , {tableAddingDatas} ); 
    return {data : {message , status , newTableSlot}};
  }catch(error){
    console.log(error); 
    throw error;
  }
}

export const getTablesSlots = async(restaurantId : string , currentPage : number)=>{
  try{
    const {data : {message , tables , totalPages }} = await axios.get(`/restaurant/tables?page=${currentPage}`); 
    return {data : {message , tables , totalPages }};
  }catch(error){
    console.log(error);  
    throw error;
  }
}
export const getAddedSlots = async(tableId : string)=>{
  try{
    const {data : {message , tableSlotDatas}} = await axios.get(`/restaurant/table-slot-list/${tableId}`); 
    return {data : {message , tableSlotDatas}};
  }catch(error){
    console.log(error);    
    throw error;
  }
}
export const tablesSlotTimeCreatingApi = async(tableSlotTimeData : object , tableId : string | undefined)=>{
  try{
    const {data : {message , addedTableSlotTime}} = await axios.post(`/restaurant/table-slot-add/`,{tableSlotTimeData , tableId}); 
    return {data : {message , addedTableSlotTime}};
  }catch(error){
    console.log(error);   
    throw error;
  }
}
export const deleteTableTimeSlot = async(tableId : string)=>{
  try{
    const {data : {message , addedTableSlotTime}} = await axios.put(`/restaurant/table-slot-delete/`,{tableId}); 
    return {data : {message , addedTableSlotTime}};
  }catch(error){
    console.log(error);    
    throw error;
  }
}