import React, { useEffect, useState }  from "react";
import DashBoardStat from "./DashBoardStats";
import TransactionChart from "./TransactionChart";
import RecentRestaurants from "./RecentRestaurants";
import ChartTwo from "./ChartTwo";
import RecentUsers from "./RecentUsers";
import axiosIntance from "../../api/axios";

interface UserType {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  phone: string;
};

interface RestaurantType {
  _id: string;
  email: string;
  restaurantName: string;
  contact: string;
  isBlocked: boolean;
}
interface totalCounts {
  totalUsers: number;
  totalRestaurants: number;
}

const Dashboard: React.FC = () => {
  const  [restaurants , setRestaurant] = useState<RestaurantType[]>([]);
  const  [users , setUsers] = useState<UserType[]>([]);
  const [count, setTotalCounts] = useState<totalCounts>({
    totalUsers: 0,
    totalRestaurants: 0,
  });

  useEffect(() => {
    axiosIntance.get("/admin/dashboard").then((res)=>{
       setRestaurant(res.data.restaurants);
       setUsers(res.data.users)
       setTotalCounts({
        totalUsers : res.data.totalUsers,
        totalRestaurants : res.data.totalRestaurants
       });
    }).catch(({response})=>{   
      console.log(response)
    })
  }, []);
  return (
    <div className=" flex flex-col gap-4 h-full ">
      <DashBoardStat count={count} />
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2">
          <TransactionChart />
        </div>
        <div className="md:w-1/2 ">
          <ChartTwo />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="md:w-1/2">
          <RecentUsers restaurants={restaurants} />
        </div>
        <div className="md:w-1/2">
          <RecentRestaurants users={users} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
