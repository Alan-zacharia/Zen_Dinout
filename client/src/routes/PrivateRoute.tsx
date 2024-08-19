import React from "react";
import {useSelector} from "react-redux";
import {Outlet , Navigate} from "react-router-dom";
import {RootState} from "../redux/store";


export  function PrivateRoute () {
    const {isAuthenticated , role} = useSelector((state : RootState)=> state.user);
    return isAuthenticated && role == "user" ? <Outlet/> : <Navigate to="/login"/>
}


export  const  SellerPrivateRoute : React.FC = ()=> {
    const {isAuthenticated , role} = useSelector((state : RootState)=> state.user);
    return isAuthenticated && role == "seller" ? <Outlet/> : <Navigate to="/restaurant/login"/>
};


export const AdminPrivateRoute : React.FC  = () => {
    const {isAuthenticated , role} = useSelector((state : RootState)=> state.user);
    return isAuthenticated && role == "admin" ? <Outlet/> : <Navigate to="/admin/login" replace/>
}