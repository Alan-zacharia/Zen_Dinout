import { UserType } from "../../entities/User";




export interface IAdminInteractor {
    adminLogin(credentials : {email : string , password:string}):Promise<{message : string , token : string | null , admin : UserType | null ; refreshToken : string | null}>,
    getUsers():Promise<{users : UserType | null , message : string}>, 
    actionInter(id : string , block : string):Promise<{users : UserType | null , message : string}>, 
    getResataurants():Promise<{restaurants : object | null , message : string}>,
    restaurantApprove():Promise<{restaurants : object | null , message : string}>,
    getRestaurantDetailsInteractor(restaurantId : string):Promise<{restaurants : object | null , message : string}>
    confirmRestaurantInteractor(restaurantId : string , login :string , rejectReason : string):Promise<{success : boolean ; message : string}>
}