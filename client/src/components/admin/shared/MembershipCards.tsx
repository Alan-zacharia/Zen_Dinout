import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { AxiosError } from "axios";
import { MembershipPlanType } from "../../../types/admin";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EditMembershipModal from "./EditMembershipModal";
import toast from "react-hot-toast";

interface MembershipCardsProps {
  mount: boolean;
}

const MembershipCards: React.FC<MembershipCardsProps> = ({ mount }) => {
  const [memberships, setMemberships] = useState<MembershipPlanType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [membershipToRemove, setMembershipToRemove] = useState<string | null>(
    null
  );
  const [membershipToEdit, setMembershipToEdit] =
    useState<MembershipPlanType | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/admin/memberships")
      .then(({ data }) => {
        setMemberships(data.memberships);
      })
      .catch(({ response }) => {
        console.error(response);
      });
  }, [mount]);

  const handleRemoveClick = (membershipId: string) => {
    setMembershipToRemove(membershipId);
    setShowModal(true);
  };

  const handleEditClick = (membership: MembershipPlanType) => {
    setMembershipToEdit(membership);
    setShowEditModal(true);
  };

  const handleConfirmRemove = () => {
    if (membershipToRemove) {
      axiosInstance
        .delete(`/admin/memberships/${membershipToRemove}`)
        .then(() => {
          setMemberships((prev) =>
            prev.map((membership) =>
              membership._id == membershipToRemove
                ? { ...membership, isActive: false }
                : membership
            )
          );

          setShowModal(false);
        })
        .catch((error) => {
          console.error("Failed to remove membership:", error);
          setShowModal(false);
        });
    }
  };

  const handleCancelRemove = () => {
    setShowModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setMembershipToEdit(null);
  };

  const handleSaveEdit = (updatedMembership: MembershipPlanType) => {
    if (updatedMembership) {
      axiosInstance
        .put(`/admin/memberships/${updatedMembership._id}`, {
          updatedMembership,
        })
        .then(() => {
          setMemberships((prev) =>
            prev.map((membership) =>
              membership._id === updatedMembership._id
                ? updatedMembership
                : membership
            )
          );
          setShowEditModal(false);
          setMembershipToEdit(null);
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
          setShowEditModal(false);
        });
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMembershipToEdit((prev) => {
      if (prev) {
        return {
          ...prev,
          [name]: value,
        };
      }
      return prev;
    });
  };

  const handleAddBenefit = () => {
    setMembershipToEdit((prev) => {
      if (prev) {
        return {
          ...prev,
          benefits: [...prev.benefits, ""],
        };
      }
      return prev;
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    setMembershipToEdit((prev) => {
      if (prev) {
        const newBenefits = [...prev.benefits];
        newBenefits[index] = value;
        return {
          ...prev,
          benefits: newBenefits,
        };
      }
      return prev;
    });
  };

  const handleRemoveBenefit = (index: number) => {
    setMembershipToEdit((prev) => {
      if (prev) {
        const newBenefits = prev.benefits.filter((_, i) => i !== index);

        return {
          ...prev,
          benefits: newBenefits,
        };
      }
      return prev;
    });
  };

  const activeMemberships =
    memberships && memberships.filter((membership) => membership.isActive);
  const inactiveMemberships =
    memberships && memberships.filter((membership) => !membership.isActive);

  return (
    <div className="space-y-5">
      {activeMemberships && activeMemberships.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Memberships</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeMemberships.map((membership) => (
              <div
                className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 relative"
                key={membership._id}
              >
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
                  onClick={() => handleRemoveClick(membership._id as string)}
                  data-tip="Remove"
                >
                  <MdDelete size={20} />
                </button>
                <button
                  className="absolute top-2 right-12 bg-blue-500 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110"
                  onClick={() => handleEditClick(membership)}
                  data-tip="Edit"
                >
                  <FaEdit size={20} />
                </button>

                <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {membership.planName}
                </h5>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ₹
                  </span>
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {membership.cost}
                  </span>
                  <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                    {membership.type}
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Discount:
                  </span>
                  <span className="ml-1 text-base font-medium text-green-500 dark:text-green-400">
                    {membership.discount}%
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Plan :
                  </span>
                  <span className="ml-1 text-base font-medium text-green-500">
                    active
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Expiry Date :
                  </span>
                  <span className="ml-1 text-base font-medium text-red-500">
                    {moment(membership.expiryDate).format("DD/MM/YYYY")}
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Benefits:
                  </li>
                  {membership.benefits.map((benefit, index) => (
                    <li className="flex items-center" key={index}>
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {inactiveMemberships && inactiveMemberships.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Inactive Memberships</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inactiveMemberships.map((membership) => (
              <div
                className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 relative"
                key={membership._id}
              >
                <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {membership.planName}
                </h5>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ₹
                  </span>
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {membership.cost}
                  </span>
                  <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                    {membership.type}
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Discount:
                  </span>
                  <span className="ml-1 text-base font-medium text-green-500 dark:text-green-400">
                    {membership.discount}%
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Plan :
                  </span>
                  <span className="ml-1 text-base font-medium text-red-500">
                    inactive
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Expiry Date :
                  </span>
                  <span className="ml-1 text-base font-medium text-red-500">
                    {moment(membership.expiryDate).format("DD/MM/YYYY")}
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    Benefits:
                  </li>
                  {membership.benefits.map((benefit, index) => (
                    <li className="flex items-center" key={index}>
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold">Confirm Removal</h3>
            <p className="mt-2">
              Are you sure you want to remove this membership? <br />
              This action is permanent and the membership cannot be reactivated.
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                onClick={handleConfirmRemove}
              >
                Yes, Remove
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={handleCancelRemove}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && membershipToEdit && (
        <EditMembershipModal
          showModal={showEditModal}
          membershipToEdit={membershipToEdit}
          handleCloseEditModal={handleCloseEditModal}
          handleSaveEdit={handleSaveEdit}
          handleEditChange={handleEditChange}
          handleAddBenefit={handleAddBenefit}
          handleBenefitChange={handleBenefitChange}
          handleRemoveBenefit={handleRemoveBenefit}
        />
      )}
    </div>
  );
};

export default MembershipCards;
