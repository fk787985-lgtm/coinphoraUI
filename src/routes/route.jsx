import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Home = lazy(() => import(/* @vite-ignore */ `../pages/Home`));
const Signin = lazy(() => import(/* @vite-ignore */ `../pages/Signin`));
const Signup = lazy(() => import(/* @vite-ignore */ `../pages/Signup`));
const Contact = lazy(() => import(/* @vite-ignore */ `../pages/Contact`));
const NotFoundPage = lazy(() =>
  import(/* @vite-ignore */ `../pages/NotFoundPage`)
);
const Onchain = lazy(() => import(/* @vite-ignore */ `../pages/Onchain`));
const Dashboard = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/admin/Dashboard`)
);
const Settings = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/admin/Settings`)
);
const Users = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/admin/Users`)
);
const AdminLayout = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/admin/AdminLayout`)
);
const Wallet = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/Onchain/Wallet`)
);
const TradingInterface = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/Onchain/TradinInterface`)
);
// const TradeResult = lazy(() =>
//   import(/* @vite-ignore */ `../pages/(Authenticated)/admin/TradeResult`)
// );

import HomeOrOnchain from "../pages/HomeOrOnchain";

import Loading from "../components/Loading";

import OnchainLayout from "../pages/OnchainLayout ";
import {
  AuthorizeUser,
  AuthorizeTeam,
  AuthorizeSuper,
  AuthorizeCustomer,
  SignUpProtectedRoute,
  VerifyEmailProtectedRoute,
} from "../middleware/auth";
import Deposit from "../pages/(Authenticated)/Onchain/Deposit";
import DepositCheckout from "../pages/(Authenticated)/Onchain/DepositCheckout";
import MarketSection from "../pages/(Authenticated)/Onchain/MarketSection";
import Orders from "../pages/(Authenticated)/Onchain/Orders";
import PaymentDetail from "../pages/(Authenticated)/Onchain/PaymentDetail";
import DepositLog from "../pages/(Authenticated)/Onchain/DepositLog";
import Setting from "../pages/(Authenticated)/Onchain/Setting";
import KYCForm from "../pages/(Authenticated)/Onchain/KYCForm";
import WithdrawCheckout from "../pages/(Authenticated)/Onchain/WithdrawCheckout";
import Withdraw from "../pages/(Authenticated)/Onchain/Withdraw";
import WithdrawLog from "../pages/(Authenticated)/Onchain/WithdrawLog";
import PaymentDetailWithdraw from "../pages/(Authenticated)/Onchain/PaymentDetailWithdraw";
import KYCSubmitOrKycStatus from "../pages/(Authenticated)/KYCSubmitOrKycStatus";
import KycDetail from "../pages/(Authenticated)/Onchain/KycDetail";
import UserProfile from "../pages/(Authenticated)/Onchain/UserProfile";
import UserPasswordChange from "../pages/(Authenticated)/Onchain/UserPasswordChange";
import Helpline from "../pages/(Authenticated)/Onchain/Helpline";
import AppNotice from "../pages/(Authenticated)/Onchain/AppNotice";
import Transfer from "../pages/(Authenticated)/Onchain/Transfer";
import TransferDetail from "../pages/(Authenticated)/Onchain/PaymentDetailTransfer";
import TransferLog from "../pages/(Authenticated)/Onchain/TransferLog";
const OrderDetail = lazy(() =>
  import(/* @vite-ignore */ `../pages/(Authenticated)/Onchain/OrderDetail`)
);


export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomeOrOnchain />,
  },
  
  {
    path: "/signin",
    element: (
      <Suspense fallback={<Loading />}>
        <Signin />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
    ),
  },
  // {
  //   path: "/onchain",
  //   element: (
  //     <Suspense fallback={<Loading />}>
  //       <Onchain />
  //     </Suspense>
  //   ),
  // },
  {
    path: "/trade",
    element: (
      <Suspense fallback={<Loading />}>
        
        <AuthorizeUser>
          <OnchainLayout>
            <TradingInterface />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/markets",
    element: (
      //<Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout>
            <MarketSection />
          </OnchainLayout>
        </AuthorizeUser>
     // </Suspense>
    ),
  },
  {
    path: "/orders",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout>
            <Orders />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/order/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Order Detail">
            <OrderDetail />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/deposit/log",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Deposit Logs">
            <DepositLog />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
   {
    path: "/withdraw/log",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Withdraw Logs">
            <WithdrawLog />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
    {
    path: "/transfer/log",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Transfer Logs">
            <TransferLog />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/deposit/log/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Payment Detail">
            <PaymentDetail />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/withdraw/log/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Payment Detail">
            <PaymentDetailWithdraw />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/transfer/log/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Transfer Detail">
            <TransferDetail />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/kyc/log",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="KYC Status">
            <KycDetail />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/wallet",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout>
            <Wallet />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/deposit",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Deposit Method">
            <Deposit />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/withdraw",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Withdraw Method">
            <Withdraw />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
    {
    path: "/transfer",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Balance Transfer">
            <Transfer />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/deposit/checkout/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Deposit Checkout">
            <DepositCheckout />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/withdraw/checkout/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Withdraw Checkout">
            <WithdrawCheckout />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/settings",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Settings">
            <Setting />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/kyc/submit-form",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="KYC">
            <KYCSubmitOrKycStatus />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
   {
    path: "/user/profile",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Profile Setting">
            <UserProfile />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
   {
    path: "/user/password",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="Account Password">
            <UserPasswordChange />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
     {
    path: "/helpline",
    element: (
      <Suspense fallback={<Loading />}>
        <OnchainLayout title="Helpline">
          <Helpline />
        </OnchainLayout>
      </Suspense>
    ),
  },
   {
    path: "/app/notice",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeUser>
          <OnchainLayout title="App Notice">
            <AppNotice />
          </OnchainLayout>
        </AuthorizeUser>
      </Suspense>
    ),
  },
  {
    path: "/admin/*",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthorizeSuper>
          <AdminLayout />
        </AuthorizeSuper>
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<Loading />}>
            <Users />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
