import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axiosInstance from "../../../api/axios";
import { ProfileNavigationProps } from "../../../types/user/userTypes";

const UserProfileDetails: React.FC<ProfileNavigationProps> = ({
  userDetails,
}) => {
  if (!userDetails)
    return (
      <span className="loading loading-dots loading-lg text-4xl text-blue-500"></span>
    );
  const { id } = useSelector((state: RootState) => state.user);

  const [nameInput, setNameInput] = useState(false);
  const [contactInput, setContactInput] = useState(false);
  const [name, setName] = useState<string>(userDetails?.username || "");
  const [contact, setContact] = useState<string>(userDetails?.phone || "");
  const onEditName = () => {
    setNameInput(!nameInput);
  };

  const onEditContact = () => {
    setContactInput(!contactInput);
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }
    try {
      await axiosInstance.patch(`/api/account/${id}`, {
        credentials: { username: name },
      });
      toast.success("Name Updated Successfully");
      setNameInput(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactSubmit = async () => {
    if (!contact) {
      toast.error("Contact is required");
      return;
    } else if (contact.length !== 10) {
      toast.error("Invalid contact number");
      return;
    }
    try {
      await axiosInstance.patch(`/api/account/${id}`, {
        credentials: { phone: contact },
      });
      toast.success("Contact Updated Successfully");
      setContactInput(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex flex-col gap-10">
      <div className="flex items-center gap-5">
        <h1 className="text-xl font-bold">Personal Info</h1>
        {!nameInput ? (
          <p
            className="text-green-500 font-bold text-sm cursor-pointer"
            onClick={onEditName}
          >
            Edit ✏
          </p>
        ) : (
          <p
            className="text-red-500 font-bold text-sm cursor-pointer"
            onClick={onEditName}
          >
            Cancel
          </p>
        )}
      </div>
      <div>
        {!nameInput ? (
          <input
            type="text"
            id="disabled-input"
            className="border cursor-not-allowed border-blue-400 rounded-lg bg-neutral-100 outline-none p-3 w-[300px] text-sm"
            disabled
            value={name}
          />
        ) : (
          <>
            <input
              type="text"
              id="disabled-input"
              className="border border-neutral-400 bg-neutral-100 outline-none p-3 w-[300px] text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="font-bold text-white bg-red-500 rounded-lg p-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-5">
        <h1 className="text-xl font-bold">Email Address</h1>
      </div>
      <div>
        <input
          type="text"
          id="disabled-input"
          className="border cursor-not-allowed rounded-lg border-blue-400 bg-neutral-100 outline-none p-3 w-[300px] text-sm"
          value={userDetails?.email}
          disabled
        />
      </div>

      <div className="flex items-center gap-5">
        <h1 className="text-xl font-bold">Contact</h1>
        {contact === undefined ? (
          !contactInput ? (
            <p
              className="text-green-500 font-bold text-base cursor-pointer"
              onClick={onEditContact}
            >
              Add
            </p>
          ) : (
            <p
              className="text-red-500 font-bold text-sm cursor-pointer"
              onClick={onEditContact}
            >
              Cancel
            </p>
          )
        ) : !contactInput ? (
          <p
            className="text-green-500 font-bold text-base cursor-pointer"
            onClick={onEditContact}
          >
            Edit ✏
          </p>
        ) : (
          <p
            className="text-red-500 font-bold text-sm cursor-pointer"
            onClick={onEditContact}
          >
            Cancel
          </p>
        )}
      </div>
      <div>
        {!contactInput ? (
          <input
            type="text"
            id="disabled-input"
            className="border cursor-not-allowed rounded-lg border-blue-400 bg-neutral-100 outline-none p-3 w-[300px] text-sm"
            disabled
            value={contact}
          />
        ) : (
          <>
            <input
              type="text"
              id="disabled-input"
              className="border border-neutral-400 bg-neutral-100 outline-none p-3 w-[300px] text-sm"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <button
              className="font-bold text-white bg-red-500 rounded-lg p-3"
              onClick={handleContactSubmit}
            >
              Submit
            </button>
          </>
        )}
      </div>

      <div>
        <Link to="/reset-password">
          <button className="font-bold text-white bg-red-500 rounded-lg p-3">
            Change Password
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <p className="pl-3 text-sm font-bold">FAQS</p>
        <div className="text-xs p-3">
          What happens when I update my email address (or mobile number)? Your
          login email id (or mobile number) changes, likewise. You'll receive
          all your account related communication on your updated email address
          (or mobile number).
        </div>
        <div className="flex justify-center">
          . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
          . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
          . . . . . . . . .
        </div>
      </div>
    </nav>
  );
};

export default UserProfileDetails;
