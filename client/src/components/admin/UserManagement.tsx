import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosActionsUser, axiosGetUser } from "../../services/adminApiClient";
import { HiOutlineSearch } from "react-icons/hi";
axios.defaults.withCredentials = true;

interface UserType {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  phone: string;
};
const Customer: React.FC = () => {
  const [users, setUser] = useState<UserType[] | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPages] = useState<number>(1);
  useEffect(() => {
    const fetchData = async () => {
      const { users, totalPages } = await axiosGetUser(currentPage);
      setUser(users);
      setTotalPages(totalPages);
    };
    setTimeout(() => {
      fetchData();
    },300);
  }, [currentPage]);
  const blockUser = (id: string, block: boolean) => {
    axiosActionsUser(id, block);
    setUser((prevUser: any) =>
      prevUser.map((user: any) =>
        user._id == id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  };
  const filteredUsers = users
    ? users.filter((datas: any) => {
        const { username, email } = datas;
        const searchTerm = searchItem.toLowerCase();
        return (
          username.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm)
        );
      })
    : [];
    
  return (
    <div className="text-gray-900  ">
      <div className="p-4 flex justify-between lg:pb-16">
        <h1 className="hidden lg:flex text-base  lg:text-3xl font-bold ">User Mangement</h1>
        <h1 className="text-2xl flex lg:hidden lg:text-3xl font-bold ">Users</h1>
        <div className="relative flex-shrink-0 w-auto ">
          <HiOutlineSearch
            fontSize={24}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            type="text"
            placeholder="Search Users....."
            className="text-sm focus:outline-none border active:outline-none  border-gray-300 h-10 w-48 lg:h-14 lg:w-[400px] pl-10 pr-4 rounded-sm"
            value={searchItem}
            onChange={handleSearchInput}
          />
        </div>
      </div>
      <div className="relative  shadow-md  border overflow-auto border-gray-300 mb-6">
        <table className="w-full text-sm text-left rtl:text-right text-black  ">
          <thead className="text-base  uppercase  bg-gray-800 text-white h-16">
            <tr>
              <th scope="col" className="px-6 py-3">
                SL No.
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email Address
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Premium member
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users == null ? (
              <tr>
                <td colSpan={4} className="pt-5">
                  <div className="w-full p-4 space-y-4 -y flex flex-col gap-5  rounded shadow animate-pulse">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-center  w-full">
                        <div className="h-8 bg-gray-300 rounded-full w-1/6 me-8"></div>
                        <div className="h-8 bg-gray-300 rounded-full w-[37%] ml-2 me-2"></div>
                        <div className="h-8 bg-gray-300 rounded-full w-1/5 ml-2 me-5"></div>
                        <div className="h-8 bg-gray-300 rounded-full w-24 ml-2"></div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user: UserType, index: number) => {
                return (
                  <tr
                    className="text-black border-t border-t-neutral-400 lg:text-base font-bold"
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4  whitespace-nowrap "
                    >
                      {index+1}.
                    </th>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    {user.phone ? (
                      <td className="px-6 py-4">+91 {user.phone}</td>
                    ) : (
                      <td className="px-6 py-4">Nill</td>
                    )}
                       <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600  hover:underline"
                      >
                        {user.isBlocked ? (
                          <button
                            onClick={() => blockUser(user._id, user.isBlocked)}
                            className="bg-red-500 p-2 rounded-xl hover:bg-red-600 text-white font-bold w-20"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => blockUser(user._id, user.isBlocked)}
                            className="bg-green-500 p-2 rounded-xl hover:bg-green-600 text-white font-bold w-20"
                          >
                            Block
                          </button>
                        )}
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b  bg-gray-100">
                <td
                  colSpan={5}
                  className="p-3 text-center text-black font-bold text-2xl"
                >
                  Users not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="Page navigation" className="flex justify-end">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex items-center justify-center px-4 mx-0.5 h-8 leading-tight cursor-pointer  bg-black border border-e-0 text-white rounded-s-lg  border-gray-700 "
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from(Array(totalPage).keys()).map((page) => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page + 1)}
                className={`flex items-center justify-center px-4  h-8 leading-tight bg-gray-900 text-white  ${
                  currentPage === page + 1
                    ? "bg-lime-600 text-white font-bold mx-0.5"
                    : ""
                } border border-gray-300   `}
              >
                {page + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center mx-0.5 justify-center px-4 h-8 leading-tight  bg-black border  rounded-e-lg dark:border-gray-700 text-white"
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Customer;
