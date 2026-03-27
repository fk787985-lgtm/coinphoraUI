import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { parseISO, format } from "date-fns"; // Import necessary functions from date-fns

const baseURL = import.meta.env.VITE_BASE_URL;

const TradeResults = () => {
  const [timeRemaining, setTimeRemaining] = useState(0); // Store time remaining to next change
  const [lastUpdated, setLastUpdated] = useState(null); // Store last updated time
  const [nextUpdate, setNextUpdate] = useState(null); // Store next update time

  // Fetch trade results and timestamps using query and include token in the headers
  const {
    data: tradeResults,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getTradeResults"], // Use the query key as an array
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/getTradeResults`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Use the fetched tradeResults directly for lastUpdated and nextUpdate
  useEffect(() => {
    if (tradeResults?.lastUpdated && tradeResults?.nextUpdate) {
      setLastUpdated(new Date(tradeResults.lastUpdated)); // Set the last updated time from the backend
      setNextUpdate(new Date(tradeResults.nextUpdate)); // Set the next update time from the backend
      updateTimeRemaining(tradeResults.nextUpdate); // Calculate time remaining for next update
    } else {
      console.error("Error: Missing lastUpdated or nextUpdate fields in the response data.");
    }
  }, [tradeResults]); // Run this effect when tradeResults change

  // Function to calculate time remaining for next update (until the next update)
  const updateTimeRemaining = (nextUpdate) => {
    const now = new Date();
    const nextUpdateDate = parseISO(nextUpdate); // Parse the ISO string into a Date object

    const remainingTime = nextUpdateDate.getTime() - now.getTime(); // Calculate remaining time
    setTimeRemaining(remainingTime);
  };

  // Update the time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining((prevTime) => prevTime - 1000); // Decrease by 1 second
      }
    }, 1000); // Update every second (1000 ms)

    return () => clearInterval(interval); // Clear interval on cleanup
  }, [timeRemaining]);

  // Formatting functions for time remaining
  const formatTimeRemaining = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Format lastUpdated and nextUpdate using date-fns format
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";

    // Check if the input is already a Date object or ISO string
    const date = (typeof dateInput === "string") ? parseISO(dateInput) : dateInput;
    
    // Ensure date is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date:", dateInput);
      return "Invalid Date";
    }

    return format(date, "yyyy-MM-dd HH:mm:ss"); // Format the date into a readable string
  };

  return (
    <div className="w-full h-screen bg-gray-800 p-6">
      <h2 className="text-3xl font-semibold text-white text-center mb-8">Trade Results</h2>

      {/* Last Updated and Time Remaining */}
      <div className="text-center text-white mb-6">
        <p>
          <strong>Last Updated:</strong> {lastUpdated ? formatDate(lastUpdated) : "N/A"} {/* Format the last updated time */}
        </p>
        <p>
          <strong>Next Update:</strong> {nextUpdate ? formatDate(nextUpdate) : "N/A"} {/* Format the next update time */}
        </p>
        <p>
          <strong>Time Remaining for Next Update:</strong>{" "}
          {timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : "00:00:00"}
        </p>
      </div>

      <div className="overflow-x-auto bg-gray-700 p-6 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-white">
              <th className="p-4">Trade Result</th>
              <th className="p-4">Buy Result (30s)</th>
              <th className="p-4">Sell Result (30s)</th>
              <th className="p-4">Buy Result (60s)</th>
              <th className="p-4">Sell Result (60s)</th>
              <th className="p-4">Buy Result (3m)</th>
              <th className="p-4">Sell Result (3m)</th>
              <th className="p-4">Buy Result (5m)</th>
              <th className="p-4">Sell Result (5m)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-600">
              <td className="text-center text-white p-4">{nextUpdate ? formatDate(nextUpdate) : "N/A"}</td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade30Second?.buy?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade30Second?.buy?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade30Second?.sell?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade30Second?.sell?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade60Second?.buy?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade60Second?.buy?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade60Second?.sell?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade60Second?.sell?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade3Min?.buy?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade3Min?.buy?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade3Min?.sell?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade3Min?.sell?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade5Min?.buy?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade5Min?.buy?.tradeResult}
                </span>
              </td>
              <td className="text-center text-white p-4">
                <span className={tradeResults?.trade5Min?.sell?.tradeResult === "Win" ? "text-green-500" : "text-red-500"}>
                  {tradeResults?.trade5Min?.sell?.tradeResult}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeResults;
