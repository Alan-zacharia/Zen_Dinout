import { RestaurantType, tableSlotTypes } from "../../entities/restaurants";


export interface IRestaurantInteractor{
    restaurantRegisteration(credentials : RestaurantType):Promise<{restaurant : object | null , message : string }>;
    reservations():Promise<{restaurant:object | null}>;
    Login(data : Partial<RestaurantType>):Promise<{restaurant : Partial<RestaurantType> | null ; message : string ; token:string | null ;refreshToken : string | null}>;
    restaurantDetailsUpdateInteractor( credentials : RestaurantType , restaurantId : string):Promise<{restaurant : Partial<RestaurantType> , message : string }>;
    sellerProfileInteractor(email : string ):Promise<{restaurant: object }>;
    createTableSlotInteractor(tableSlotDatas : tableSlotTypes ,  restaurantId : string) : Promise<{message : string ; status : boolean}>
    getRestaurantTableInteractor(restaurantId : string) : Promise<{message : string ; tableSlotDatas : object }>
    getRestaurantTableSlotsInteractor(tableId : string) : Promise<{message : string ; tableSlotDatas : object }>
    createTableTimeSlotInteractor(tableSlotTimeData : object , tableId : string) : Promise<{message : string ; status : boolean }>
    deleteTableSlotInteractor(tableId : string) : Promise<{message : string ; status : boolean }>
}