import React from "react";
import NavBar from "../../components/user/layouts/NavBar";
import Footer from "../../components/user/layouts/Footer";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsChatRightFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <div className="h-screen relative overflow-auto">
      <div className="sticky z-50 top-0 left-0 w-full">
        <NavBar />
      </div>

      <div>
        <Outlet />

        {isAuthenticated && role == "user" && (
          <section className="sticky bottom-10 flex justify-end pr-4">
            <div
              className="tooltip cursor-pointer rounded-full p-3.5 bg-blue-400 "
              onClick={() => navigate("/chat")}
              data-tip="Messages"
            >
              <BsChatRightFill size={25} className="text-white" />
            </div>
          </section>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
