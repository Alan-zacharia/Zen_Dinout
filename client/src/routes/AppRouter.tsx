import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
const Signup = React.lazy(() => import("../pages/user/Register"));
const Login = React.lazy(() => import("../pages/user/Login"));
const AdminLogin = React.lazy(() => import("../pages/admin/AdminLogin"));
import AdminLayout from "../pages/admin/AdminHome";
import NewRestaurants from "../components/admin/RestaurantRegistrationMan";
import SellerDashBoard from "../components/seller/SellerDashBoard";
import Reservation from "../components/seller/Reservation";
import Table from "../components/seller/Table";
const Menu = React.lazy(() => import("../components/seller/Menu"));
import PageNotFound from "../pages/PageNotFound";
const RestaurantViewDetails = React.lazy(
  () => import("../pages/user/RestaurantViewDetails")
);
import RestaurantHome from "../pages/restaurant/RestauarantHome";
import RestaurantRegisterationPage from "../pages/restaurant/RestaurantRegisterationPage";
import RestaurantLoginPage from "../pages/restaurant/RestaurantLoginPage";
const RestaurantProfile = React.lazy(
  () => import("../pages/restaurant/RestaurantProfile")
);
const UserProfile = React.lazy(() => import("../pages/user/UserProfile"));
const HomeLayout =   React.lazy(
  () => import("../components/user/layouts/HomeLayout"));
import ForgotPassword from "../pages/user/ForgotPassword";
import RestaurantApprovalForm from "../components/admin/RestaurantApprovalForm";
import ForgotPasswordPageRecieveEmail from "../pages/user/ForgotPasswordPageRecieveEmail";
import { localStorageGetItem } from "../utils/localStorageImpl";
import ReserveTableConfirmation from "../components/user/ReserveTableConfirmation";
import BookingPaymentStatus from "../components/layouts/BookingPaymentStatus";
import AddTableSlots from "../components/seller/AddTableSlots";
import {
  PrivateRoute,
  SellerPrivateRoute,
  AdminPrivateRoute,
} from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import SingleReservationDetailedView from "../components/seller/SingleReservationDetailedView";
import Coupons from "../components/admin/Coupons";
import MemberShip from "../components/admin/MemberShip";
import Loading from "../components/layouts/Loading";
import ChatPage from "../pages/ChatPage";
import TimeSlots from "../components/seller/TimeAdd";
import BookingWalletStatus from "../components/layouts/BookingWalletStatus";
const HomePage = React.lazy(() => import("../pages/user/Home"));
const DashBoard = React.lazy(() => import("../components/admin/DashBoard"));
const RestaurantsListingPage = React.lazy(
  () => import("../pages/user/RestaurantsListingPage")
);
const MembershipListedPage = React.lazy(
  () => import("../pages/user/MembershipListedPage")
);
const RestaurantMangement = React.lazy(
  () => import("../components/admin/RestaurantManagement")
);
const Customers = React.lazy(
  () => import("../components/admin/UserManagement")
);

const AppRouter: React.FC = () => {
  const resetPassword = localStorageGetItem("&reset%pas%%");

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* !------> USER AUTH ROUTES <------! */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </Route>

          {/* !------> USER ROUTES <------! */}
          <Route path="/" element={<HomePage />}>
            <Route index element={<HomeLayout />} />
            <Route
              path="/restaurant-view/:restaurantId"
              element={<RestaurantViewDetails />}
            />
            <Route
              path="/all-restaurants"
              element={<RestaurantsListingPage />}
            />

            {/* !------> PRIVATE ROUTE <------! */}

            <Route element={<PrivateRoute />}>
              <Route
                path="/reserve-table"
                element={<ReserveTableConfirmation />}
              />
              <Route
                path="/payment-status/:id"
                element={<BookingPaymentStatus />}
              />
              <Route
                path="/booking-confirmed/:id"
                element={<BookingWalletStatus />}
              />
              <Route path="/memberships" element={<MembershipListedPage />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<UserProfile />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route
            path="/reset-password"
            element={<ForgotPasswordPageRecieveEmail />}
          />
          <Route
            path="/reset-password/fps/:id"
            element={resetPassword ? <ForgotPassword /> : <Navigate to="*" />}
          />
          <Route path="*" element={<PageNotFound />} />

          {/** <------ USER ROUTES END -----> */}

          {/* <------ ADMIN AUTH ROUTES  ----->  */}
          <Route element={<PublicRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
          {/* <------ ADMIN AUTH ROUTES END ----->  */}

          {/* <------ ADMIN ROUTES  ----->  */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin/" element={<AdminLayout />}>
              <Route index element={<DashBoard />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route
                path="/admin/restaurants"
                element={<RestaurantMangement />}
              />
              <Route
                path="/admin/new-registerations"
                element={<NewRestaurants />}
              />
              <Route
                path="/admin/restaurant-approval/:id"
                element={<RestaurantApprovalForm />}
              />
              <Route path="/admin/coupons" element={<Coupons />} />
              <Route path="/admin/memberships" element={<MemberShip />} />
            </Route>
          </Route>
          {/* <------ ADMIN ROUTES END  ----->  */}

          {/* <------ SELLER AUTH ROUTES  ----->  */}
          <Route element={<PublicRoute />}>
            <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
            <Route
              path="/restaurant/registeration"
              element={<RestaurantRegisterationPage />}
            />
          </Route>
          {/* <------ SELLER AUTH ROUTES END  ----->  */}

          {/* <------ SELLER ROUTES  ----->  */}
          <Route element={<SellerPrivateRoute />}>
            <Route path="/restaurant/" element={<RestaurantHome />}>
              <Route index element={<SellerDashBoard />} />
              <Route
                path="/restaurant/reservations"
                element={<Reservation />}
              />
              <Route
                path="/restaurant/reservations/view/:bookingId"
                element={<SingleReservationDetailedView />}
              />
              <Route path="/restaurant/table" element={<Table />} />
              <Route path="/restaurant/time-slots" element={<TimeSlots />} />
              <Route path="/restaurant/menu" element={<Menu />} />

              <Route
                path="/restaurant/profile"
                element={<RestaurantProfile />}
              />

              <Route
                path="/restaurant/view-table/:tableId"
                element={<AddTableSlots />}
              />
            </Route>
            <Route path="/restaurant/chat" element={<ChatPage />} />
          </Route>

          {/* <------ SELLER ROUTES END  ----->  */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
