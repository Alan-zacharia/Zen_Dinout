import axios from "../api/axios";
axios.defaults.withCredentials = true;

export const axiosGetUser = async(page : number)=>{
    try{ 
        const {data : {users , message , totalPages}} = await axios.get(`/admin/users?page=${page}`);
         console.log({users , message , totalPages})    
          return { users , message , totalPages};
    }catch(error : any){
        console.log(error.message); 
        throw error;
    }
};
export const axiosActionsUser = async(id : string , block : boolean)=>{
    try{
        const {data : {users , message}} = await axios.patch(`/admin/users/${id}/${block}`);
         console.log({users , message })
          return { users , message };
    }catch(error : any){
        console.log(error.message); 
        throw error;
    }
};
export const validateToken_admin = async()=>{

        const response = await axios.get(`/admin/validate-token`);
        if(response.status !== 200){
           throw new Error("Token invalid");
        }
        return response
  
};




