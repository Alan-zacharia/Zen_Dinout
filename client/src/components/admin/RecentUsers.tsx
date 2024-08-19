import React from 'react'
import { Link } from 'react-router-dom';

interface RestaurantType {
  _id: string;
  email: string;
  restaurantName: string;
  contact: string;
  isBlocked: boolean;
}
interface RecentUsersProps {
  restaurants : RestaurantType[]
}
const RecentUsers : React.FC<RecentUsersProps> = ({restaurants}) => {
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm flex-1 border-gray-200">
    <strong className=" font-bold text-xl">
      Recent Restaurants
    </strong>
    <div className="mt-3">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-blue-500  h-14 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Sl No.
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email address
              </th>
              <th scope="col" className="px-6 py-3">
                view
              </th>
            </tr>
          </thead>
          <tbody>
          {restaurants.map((restaurant , index : number)=>(
            <tr className="bg-white border-b  dark:border-gray-700 text-black">
               <td className="px-6 py-4">{(index + 1)}.</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
             
                {restaurant.restaurantName}
              </th>
              <td className="px-6 py-4">{restaurant.email}</td>
              <Link to="/admin/restaurants"><td className="px-6 py-4"><button className="h-8 w-16 bg-blue-400 hover:bg-blue-300 rounded-lg text-white">view</button></td></Link>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default  React.memo(RecentUsers);
