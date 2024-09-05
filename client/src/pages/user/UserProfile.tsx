import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "../../api/axios";
import { RegistercredentialsType } from "../../types/user/userTypes";
import BookingHistory from "../../components/user/profile/BookingHistory";
import NavBar from "../../components/user/layouts/NavBar";
import BookMarks from "../../components/user/profile/BookMarks";
import BookingDetailedView from "../../components/user/profile/BookingDetailedView";
import Wallet from "../../components/user/profile/Wallet";
import Coupons from "../../components/user/profile/CouponsList";
import ProfileNavigations from "../../components/user/profile/ProfileNavigations";
import UserProfileDetails from "../../components/user/profile/UserProfileDetails";

const UserProfile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigation = searchParams.get("list_name");
  const [userDetails, setUserDetails] =
    useState<RegistercredentialsType | null>(null);
  const [navigationChange, setNavigationChange] = useState<string>("profile");
  const { isAuthenticated, role, id } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated && role === "user") {
          const response = await axios.get(`/api/account/${id}`);
          setUserDetails(response.data.userData);
          if (response.data.userData) {
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (navigation) {
      setNavigationChange(navigation);
    }
  }, [navigation]);

  return (
    <section>
      <div className="sticky top-0 left-0 w-full z-50">
        <NavBar />
      </div>
      <header className="p-1 bg-neutral-100 font-semibold cursor-pointer">
        <ul className="flex gap-5 container justify-end ">
          <Link to={"/memberships"}>
            <li className="text-sm">Memberships</li>
          </Link>
        </ul>
      </header>

      <main className="flex justify-center pt-7  min-h-screen  bg-gray-50 relative">
        <div className="w-11/12 max-w-[1200px] h-[800px] flex flex-row gap-6 overflow-hidden ">
          <ProfileNavigations userDetails={userDetails} />
          <div className="lg:w-2/3 overflow-y-auto ">
            <div className="bg-white shadow-xl shadow-neutral-300 p-5 rounded-lg">
              {navigationChange === "profile" && (
                <UserProfileDetails userDetails={userDetails} />
              )}
              {navigationChange === "bookings" && (
                <>
                  <h1 className="text-2xl font-bold text-black mb-4">
                    Booking History
                  </h1>
                  <div className="max-h-[700px]  overflow-y-auto">
                    <BookingHistory />
                  </div>
                </>
              )}
              {navigationChange === "bookmarks" && (
                <>
                  <h1 className="text-2xl font-bold text-black mb-4">
                    {navigationChange}
                  </h1>
                  <div className="max-h-[700px] overflow-y-auto">
                    <BookMarks />
                  </div>
                </>
              )}
              {navigationChange === "Wallet" && (
                <>
                  <h1 className="text-2xl font-bold text-black mb-4">Wallet</h1>
                  <div className="max-h-[700px] overflow-y-auto">
                    <Wallet />
                  </div>
                </>
              )}
              {navigationChange === "Coupons" && (
                <>
                  <h1 className="text-2xl font-bold text-black mb-4">
                    Your Coupons
                  </h1>
                  <div className="max-h-[700px] overflow-y-auto">
                    <Coupons />
                  </div>
                </>
              )}

              {navigationChange.startsWith("bookings/") && (
                <>
                  <div className="max-h-[700px] overflow-y-auto">
                    <BookingDetailedView
                      bookingId={navigationChange.split("/")[1]}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default UserProfile;
