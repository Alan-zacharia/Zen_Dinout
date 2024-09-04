import React from "react";

import { Link } from "react-router-dom";
interface UserType {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  phone: string;
}
interface RecentUserProps {
  users : UserType[];
}
const RecentUsers: React.FC<RecentUserProps> = ({users}) => {
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm flex-1 border-gray-700">
      <strong className=" font-bold  text-xl">
        Recent Users
      </strong>
      <div className="mt-3">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-300">
            <thead className="text-xs uppercase  bg-blue-500 border  h-14 text-white ">
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
            {users && users.length > 0 && users.map((user , index : number)=>(
              <tr className=" text-black border-b bg-white border-gray-300">
                 <td className="px-6 py-4">{(index + 1)}.</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
               
                  {user.username}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <Link to="/admin/customers"><td className="px-6 py-4"><button className="h-8 w-16 bg-blue-400 hover:bg-blue-300 rounded-lg text-white">view</button></td></Link>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecentUsers);
