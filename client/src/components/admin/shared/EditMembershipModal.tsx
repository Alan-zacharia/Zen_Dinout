import React from "react";
import moment from "moment";
import { MembershipPlanType } from "../../../types/admin";

interface EditMembershipModalProps {
  showModal: boolean;
  membershipToEdit: MembershipPlanType | null;
  handleCloseEditModal: () => void;
  handleSaveEdit: (updatedMembership: MembershipPlanType) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddBenefit: () => void;
  handleBenefitChange: (index: number, value: string) => void;
  handleRemoveBenefit: (index: number) => void;
}

const EditMembershipModal: React.FC<EditMembershipModalProps> = ({
  showModal,
  membershipToEdit,
  handleCloseEditModal,
  handleSaveEdit,
  handleEditChange,
  handleAddBenefit,
  handleBenefitChange,
  handleRemoveBenefit,
}) => {
  if (!showModal || !membershipToEdit) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Membership</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <input
              type="text"
              name="planName"
              value={membershipToEdit.planName}
              onChange={handleEditChange}
              className="input input-bordered w-full h-[35px] sm:h-[40px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={membershipToEdit.description}
              onChange={handleEditChange}
              className="input input-bordered w-full h-[35px] sm:h-[40px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="number"
              name="cost"
              value={membershipToEdit.cost}
              onChange={handleEditChange}
              className="input input-bordered w-full h-[35px] sm:h-[40px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <input
              type="number"
              name="discount"
              value={membershipToEdit.discount}
              onChange={handleEditChange}
              className="input input-bordered w-full h-[35px] sm:h-[40px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={moment(membershipToEdit.expiryDate).format("YYYY-MM-DD")}
              onChange={handleEditChange}
              className="input input-bordered w-full h-[35px] sm:h-[40px]"
            />
          </div>
          <label className="block text-sm font-medium text-gray-700">Benefits</label>
          <ul className="relative mb-2 pl-5 list-disc">
            {membershipToEdit.benefits.map((benefit, index) => (
              <li
                key={index}
                className="relative pl-4 mb-1 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500"
              >
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-red-500"
                  onClick={() => handleRemoveBenefit(index)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleAddBenefit}
          >
            Add Benefit
          </button>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => handleSaveEdit(membershipToEdit)}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              onClick={handleCloseEditModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMembershipModal;
