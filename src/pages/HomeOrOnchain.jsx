import { lazy, Suspense } from "react";

const Home = lazy(() => import(/* @vite-ignore */ "../pages/Home"));
const Onchain = lazy(() => import(/* @vite-ignore */ "../pages/Onchain"));
import Loading from "../components/Loading";

const HomeOrOnchain = () => {
  const token = localStorage.getItem("uToken");

  return (
    <Suspense fallback={<Loading />}>
      {token ? <Onchain /> : <Home />}
    </Suspense>
  );
};

export default HomeOrOnchain;
