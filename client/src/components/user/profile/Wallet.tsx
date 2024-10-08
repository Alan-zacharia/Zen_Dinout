import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import { FaRupeeSign } from "react-icons/fa";
import { WalletType } from "../../../types/userTypes";
import moment from "moment";

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletType | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await axiosInstance.get("/api/wallet");
        setWallet(res.data.wallet);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWalletData();
  }, []);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="text-xl flex items-center gap-2">
        <h5 className="text-xl font-bold">Balance:{" "}</h5>
        <span className="flex items-center">
          <FaRupeeSign size={15} />
          {wallet?.balance ? wallet?.balance.toFixed(2) : 0}
        </span>
      </div>

      <h3 className="text-xl font-bold mt-4">Transaction History</h3>
      {wallet?.transactions && wallet.transactions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {wallet.transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-6 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-gray-700">
                  {moment(transaction.date).format("DD-MM-YYYY  hh:mm A")}
                </span>
                <span
                  className={`${
                    transaction.type == "credit"
                      ? "text-green-500 text-sm "
                      : "text-red-500 text-sm"
                  }" font-bold text-sm"`}
                >
                  {transaction.type}
                </span>
              </div>
              <span
                className={`font-semibold ${
                  transaction.type === "credit"
                    ? "text-green-500"
                    : "text-red-500"
                } flex items-center`}
              >
                <FaRupeeSign size={15} />
                {transaction?.amount?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex justify-center text-lg">No transactions found.</p>
      )}
    </div>
  );
};

export default Wallet;
