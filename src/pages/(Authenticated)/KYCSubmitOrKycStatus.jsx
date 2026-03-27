import { lazy, Suspense } from "react";
// const Home = lazy(() => import(/* @vite-ignore */ "../pages/Home"));
const KYCForm = lazy(() =>
  import(/* @vite-ignore */ "../(Authenticated)/Onchain/KYCForm")
);
const KycDetail = lazy(() =>
  import(/* @vite-ignore */ "../(Authenticated)/Onchain/KycDetail")
);

import Loading from "../../components/Loading";
const baseURL = import.meta.env.VITE_BASE_URL;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const KYCSubmitOrKycStatus = () => {
  const { data: userData, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const token = localStorage.getItem("uToken");
      const { data } = await axios.get(`${baseURL}/api/getUserById`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });
  return (
    <Suspense fallback={<Loading />}>
      {userData?.isVerified || userData?.isVerificationPending ? <KycDetail /> : <KYCForm />}
    </Suspense>
  );
};

export default KYCSubmitOrKycStatus;
