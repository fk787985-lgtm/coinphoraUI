import React, { ReactElement, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;
import cn from "../../../utils/cn";
import {
  ChevronDown,
  ChevronUp,
  Gauge,
  Home,
  Settings,
  Settings2,
  Users,
  Users2,
  KeyIcon,
  Coins,
  Key,
  CoinsIcon,
  BadgeIndianRupee,
  TriangleDashedIcon,

} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LinkProps {
  to: string;
  label: string;
  icon: ReactElement;
}

const SidebarItem = ({ to, icon, label }: LinkProps) => {
  
  const [expanded, setExpanded] = useState<String>();
  const location = useLocation();
  const adminIndex = location.pathname.indexOf("/admin");

  let routerPath = "/";
  if (adminIndex !== -1) {
    const pathAfterAdmin = location.pathname.substring(
      adminIndex + "/admin".length
    );
    const segments = pathAfterAdmin.split("/");
    if (segments.length >= 2) {
      routerPath = segments[1];
    }
  }

  // Check if the current path starts with the specified route
  const isCurrentRoute = location.pathname.startsWith(`/admin/${to}`);
  return (
    <NavLink
      to={`/admin/${to}`}
      className={cn(
        "group relative w-full mt-0.5  px-2 py-1.5 flex items-center rounded hover:bg-gray-700 text-white  cursor-pointer",
        {
          "text-gray-100  bg-gray-700": isCurrentRoute,
        }
      )}
    >
      {React.cloneElement(icon, {
        className: `w-3.5 h-3.5 mr-2   ${
          routerPath === to ? "text-gray-100" : " text-gray-200"
        }`,
      })}
      <p
        className={cn({
          "text-white": isCurrentRoute,
        })}
      >
        {" "}
        {label}
      </p>
    </NavLink>
  );
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const userLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();  // Clears all items from localStorage
    navigate("/signin");  // Redirects to the home page (or any route you specify)
  };
  useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const token = await localStorage.getItem("token");
      const { data } = await axios.get(
        `${baseURL}/api/getAdminProfile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(data?.adminProfile)
      return data?.adminProfile;
    },
  });

  const SidebarItemUsers = ({ to, icon, label }: LinkProps) => {
    const [expanded, setExpanded] = useState<String>();
    const location = useLocation();
    const adminIndex = location.pathname.indexOf("/admin");

    let routerPath = "/";
    if (adminIndex !== -1) {
      const pathAfterAdmin = location.pathname.substring(
        adminIndex + "/admin".length
      );
      const segments = pathAfterAdmin.split("/");
      if (segments.length >= 2) {
        routerPath = segments[1];
      }
    }

    // Check if the current path starts with the specified route
    const isCurrentRoute = location.pathname.startsWith(`/admin/${to}`);

    return (
      <div>
        <h1
          onClick={() => {
            if (expanded == "user") {
              setExpanded("");
            } else {
              setExpanded("user");
            }
          }}
          className={cn(
            "group relative justify-between w-full gap-2 px-2 py-2 flex items-center rounded hover:bg-gray-700 cursor-pointer",
            {
              "text-white bg-gray-700": isCurrentRoute,
            }
          )}
        >
          <div className="flex items-center justify-between gap-2 text-white">
            <Users
              className={`w-4 ${
                expanded == "stock" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            Users
          </div>

          {expanded === "user" ? (
            <ChevronUp className="w-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 text-gray-400" />
          )}
        </h1>

        {expanded == "user" && (
          <div>
            <ul className="flex flex-col mt-2">
              <NavLink
                to={`/admin/${to}/all`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/all`,
                  }
                )}
              >
                All
              </NavLink>

              <NavLink
                to={`/admin/users/active`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/active`,
                  }
                )}
              >
                Active
              </NavLink>

              <NavLink
                to={`/admin/users/free`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/free`,
                  }
                )}
              >
                Free
              </NavLink>

              <NavLink
                to={`/admin/users/overdue`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/overdue`,
                  }
                )}
              >
                Overdue
              </NavLink>

              <NavLink
                to={`/admin/users/deactive`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/deactive`,
                  }
                )}
              >
                Deactive
              </NavLink>
            </ul>
          </div>
        )}
      </div>
    );
  };

  const SidebarItemAdmin = ({ to, icon, label }: LinkProps) => {
    const [expanded, setExpanded] = useState<String>();
    const location = useLocation();
    const adminIndex = location.pathname.indexOf("/admin");

    let routerPath = "/";
    if (adminIndex !== -1) {
      const pathAfterAdmin = location.pathname.substring(
        adminIndex + "/admin".length
      );
      const segments = pathAfterAdmin.split("/");
      if (segments.length >= 2) {
        routerPath = segments[1];
      }
    }

    // Check if the current path starts with the specified route
    const isCurrentRoute = location.pathname.startsWith(`/admin/${to}`);

    return (
      <div>
        <div>
          <ul className="flex flex-col">
            <NavLink
              to={`/admin/admins/all`}
              className={cn(
                "group relative  w-full  flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                {
                  "text-white bg-gray-700":
                    location.pathname === `/admin/${to}/all`,
                }
              )}
            >
              <h1
                onClick={() => {
                  if (expanded == "settings") {
                    setExpanded("");
                  } else {
                    setExpanded("settings");
                  }
                }}
                className={cn(
                  "group relative justify-between w-full gap-2 px-2 py-2 flex items-center rounded hover:bg-gray-700 cursor-pointer",
                  {
                    "text-white bg-gray-700": isCurrentRoute,
                  }
                )}
              >
                <div className="flex items-center justify-between gap-2 text-white">
                  <Users2
                    className={`w-4 ${
                      expanded == "settings" ? "text-white" : "text-gray-400"
                    }`}
                  />
                 Admins
                </div>

              </h1>
            </NavLink>
          </ul>
        </div>
      </div>
    );
  };
  const SidebarItemSettings = ({ to, icon, label }: LinkProps) => {
    const [expanded, setExpanded] = useState<String>();
    const location = useLocation();
    const adminIndex = location.pathname.indexOf("/admin");

    let routerPath = "/";
    if (adminIndex !== -1) {
      const pathAfterAdmin = location.pathname.substring(
        adminIndex + "/admin".length
      );
      const segments = pathAfterAdmin.split("/");
      if (segments.length >= 2) {
        routerPath = segments[1];
      }
    }

    // Check if the current path starts with the specified route
    const isCurrentRoute = location.pathname.startsWith(`/admin/${to}`);

    return (
      <div>
        <h1
          onClick={() => {
            if (expanded == "settings") {
              setExpanded("");
            } else {
              setExpanded("settings");
            }
          }}
          className={cn(
            "group relative justify-between w-full gap-2 px-2 py-2 flex items-center rounded hover:bg-gray-700 cursor-pointer",
            {
              "text-white bg-gray-700": isCurrentRoute,
            }
          )}
        >
          <div className="flex items-center justify-between gap-2 text-white">
            <Settings2
              className={`w-4 ${
                expanded == "settings" ? "text-white" : "text-gray-400"
              }`}
            />
            Settings
          </div>

          {expanded === "settings" ? (
            <ChevronUp className="w-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 text-gray-400" />
          )}
        </h1>

        {expanded == "settings" && (
          <div>
            <ul className="flex flex-col mt-2 ">
              <NavLink
                to={`/admin/${to}/profile`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/profile`,
                  }
                )}
              >
                Profile settings
              </NavLink>
              <NavLink
                to={`/admin/${to}/company`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/company`,
                  }
                )}
              >
                Company Admin Settings
              </NavLink>

              <NavLink
                to={`/admin/${to}/price`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/price`,
                  }
                )}
              >
                Price Settings
              </NavLink>

              <NavLink
                to={`/admin/${to}/website`}
                className={cn(
                  "group relative ml-4 w-full px-2 py-1 flex items-center rounded gap-2 hover:bg-gray-700 text-white/70 cursor-pointer",
                  {
                    "text-white bg-gray-700":
                      location.pathname === `/admin/${to}/website`,
                  }
                )}
              >
                Website Settings
              </NavLink>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className=" w-52 relative bg-gray-800 border-gray-200 overflow-hidden   flex-col p-1  ">
      <div className=" flex flex-col gap-4 justify-between h-full p-2 rounded-lg border-gray-50">
        <ul className="flex flex-col flex-1 gap-1  ">
          <SidebarItem to="dashboard" icon={<Gauge />} label="Dashboard" />
          <SidebarItem to="users" icon={<Users2 />} label="Manage Users" />
          <SidebarItem to="pendingKyc" icon={<Key />} label="Pending Kyc" />
          <SidebarItem to="coins" icon={<CoinsIcon />} label="Manage Coins" />
          <SidebarItem to="depositMethod" icon={<BadgeIndianRupee />} label="Deposit Method" />
          <SidebarItem to="deposit/logs" icon={<CoinsIcon />} label="Deposit Log" />
          {/* <SidebarItem to="transaction" icon={<TriangleDashedIcon />} label="Transaction" /> */}
          
          <SidebarItem to="withdrawMethod" icon={<CoinsIcon />} label="Withdraw Method" />
          <SidebarItem to="withdraw/logs" icon={<CoinsIcon />} label="Withdraw Log" />
          <SidebarItem to="tradeResult" icon={<TriangleDashedIcon />} label="Trade Result" />

          <SidebarItem to="settings" icon={<Settings />} label="Site Setting" />

          {/* <SidebarItemUsers to="users" icon={<Users2 />} label="Users" />
          <SidebarItemAdmin to="admin" icon={<Users2 />} label="Admins" /> */}

          {/* <SidebarItemSettings
            to="settings"
            icon={<Settings />}
            label="Settings"
          /> */}
          {/* <SidebarItem to="logs" icon={<Gauge />} label="Logs" /> */}
          <button
            className="p-2 bg-white rounded-lg mt-12"
            onClick={userLogout}
          >
            Log out
          </button>
        </ul>
      </div>

      {/* <div className="absolute  bottom-1 right-2 border-r bg-white rounded-xl p-0.5">
        <p className="px-6 ">
          @2025 xCrypto
        </p>
      </div> */}
    </div>
  );
};

export default AdminSidebar;
