// OnchainLayout.jsx
import React from 'react';
import Navbar from './(Authenticated)/Onchain/Navbar';
import BottomNav from './(Authenticated)/Onchain/BottomNav';

const OnchainLayout = ({ children, title }) => {
  return (
    <div className="bg-[#0d111c] text-white min-h-screen font-sans relative">
      <Navbar title={title} />  {/* Pass the title to Navbar */}
      <div>{children}</div>
      <BottomNav />
    </div>
  );
};

export default OnchainLayout;
