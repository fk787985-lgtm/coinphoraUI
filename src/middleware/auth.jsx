import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { useLocation } from 'react-router-dom';
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import jwt_decode from 'jwt-decode';
// Function to check and clear expired tokens
// function clearExpiredTokens() {
//   const storedToken = localStorage.getItem("sToken");
//   if (storedToken) {
//     const tokenData = JSON.parse(storedToken);
//     const currentTime = new Date().getTime();
//     if (currentTime > tokenData.expiresAt) {
//       localStorage.removeItem("sToken");
//     }
//   }
// }
export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem("uToken");

  if (!token) {
    
    return <Navigate to={"/signin"} replace={true}></Navigate>;
  }

  return children;
};

// export const AuthorizeUser = ({ children }) => {
//   const [isValid, setIsValid] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("uToken");

//     if (!token) {
//       setIsValid(false);
//       return;
//     }

//     const verifyToken = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/api/verify-token`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.status === 200) {
//           setIsValid(true);
//         } else {
//           setIsValid(false);
//         }
//       } catch (err) {
//         localStorage.removeItem("uToken"); // optional: cleanup invalid token
//         setIsValid(false);
//       }
//     };

//     verifyToken();
//   }, []);

//   if (isValid === null) {
//     return <div>Loading...</div>;
//   }

//   if (!isValid) {
//     return <Navigate to="/signin" replace={true} />;
//   }

//   return children;
// };


// export const AuthorizeUser = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated === null) {
//     return null; // No flash
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   return children;
// };

export const AuthorizeTeam = ({ children }) => {
  const tToken = localStorage.getItem("tToken");

  if (!tToken) {
    return <Navigate to={"/teamsignin"} replace={true}></Navigate>;
  }

  return children;
};
export const AuthorizeSuper = ({ children }) => {
  // useEffect(() => {
  //   clearExpiredTokens();
  // }, []);
  const sToken = localStorage.getItem("token");

  if (!sToken) {
    return <Navigate to={"/signin"} replace={true}></Navigate>;
  }

  return children;
};
export const AuthorizeCustomer = ({ children }) => {
  const cToken = localStorage.getItem("cToken");

  if (!cToken) {
    return <Navigate to={"/customersignin"} replace={true}></Navigate>;
  }

  return children;
};

export const ProtectRoute = ({ children }) => {
  const username = useAuthStore.getState().auth.username;
  if (!username) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};

// signUpProtectedRoute.tsx or signUpProtectedRoute.js


export const SignUpProtectedRoute = ({ children }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const planId = query.get("planId");

  // If planId is not present, redirect to the pricing page
  if (!planId) {
    return <Navigate to="/pricing" replace />;
  }

  return children; // If planId exists, render the children
};

export const VerifyEmailProtectedRoute = ({ children }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const id = query.get("id");

  // If token is not present, redirect to the pricing page
  if (!token && !id) {
    return <Navigate to="/pricing" replace />;
  }

  return children; // If id exists, render the children
};

export const AuthorizeUserPermission = ({ children }) => {
  const token = localStorage.getItem("tToken");
  // console.log(token)
  // const { data: apiData, isLoading, isError } = useQuery({
  //   queryKey: ["teamCompanyteams"],
  //   queryFn: async () => {
  //     const token = localStorage.getItem("tToken");
  //     if (!token) throw new Error("No token found");
  //     const { data } = await axios.get("http://localhost:3000/api/getTeamId", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     return data;
  //   },
  //   retry: false, // Optionally disable retry
  // });
  // console.log("AuthorizeUserPermission", apiData)
  if (!token) {
    
    return <Navigate to={"/"} replace={true}></Navigate>;
  }

  return children;
};