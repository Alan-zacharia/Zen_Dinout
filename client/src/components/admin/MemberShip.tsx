import React, { useState } from "react";
import MembershipAddModal from "./shared/MembershipAddModal";
import MembershipCards from "./shared/MembershipCards";

const MemberShip: React.FC = () => {
  const [mount , setMount] = useState<boolean>(false);
  const handlePlanModal = () => {
    setMount(!mount)
  };
  return (
    <div className="text-gray-900  ">
      <div className="p-4 flex justify-between ">
        <h1 className="hidden lg:flex  lg:text-3xl font-bold ">
          Membership Mangement.
        </h1>
        <h1 className="text-2xl flex lg:hidden lg:text-3xl font-bold ">
          Memberships
        </h1>
        <div className="flex justify-end">
          <MembershipAddModal onCouponAdded={handlePlanModal} />
        </div>
      </div>
      '
      <div className="flex flex-wrap  gap-8">
        <MembershipCards mount={mount}/>
      </div>
    </div>
  );
};

export default MemberShip;
