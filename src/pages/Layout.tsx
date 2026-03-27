import { ReactNode } from "react";
// import Footer from "../components/landing/Footer";
// import Navbar from "../components/landing/Navbar";
import React from "react";


interface Layout {
  children: ReactNode;
}

const Layout = ({ children }: Layout) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex-1 pt-[30px] scroll-smooth"> {/* Adjust the value here based on the actual height of your navbar */}
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
