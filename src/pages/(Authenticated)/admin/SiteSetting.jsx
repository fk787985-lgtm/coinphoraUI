import React from "react";
import { useFormik } from "formik";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUpdateSiteSetting } from "../../../hooks/userUpdateUserState";
const baseURL = import.meta.env.VITE_BASE_URL;

const SiteSetting = () => {
  const updateMutation = useUpdateSiteSetting();

  const {
    data: siteSetting,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSiteSetting"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseURL}/api/getSiteSetting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const formik = useFormik({
    initialValues: {
      siteTitle: siteSetting?.siteTitle,
      siteCurrency: siteSetting?.siteCurrency,
      currencySymbol: siteSetting?.currencySymbol,
      transferMin: siteSetting?.transferMin,
      transferMax: siteSetting?.transferMax,
      transferCharge: siteSetting?.transferCharge,
      botTreadingProfit: siteSetting?.botTreadingProfit,
      botTreadingMin: siteSetting?.borTreadingMin,
      trade30Second: siteSetting?.trade30Second,
      trade60Second: siteSetting?.trade60Second,
      trade3Min: siteSetting?.trade3Min,
      trade5min: siteSetting?.trade5min,
      telegramLink: siteSetting?.telegramLink,
      emailLink: siteSetting?.emailLink,
      whatsappLink: siteSetting?.whatsappLink,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateMutation.mutateAsync(values);
        toast.success("Site settings updated successfully!");
      } catch (err) {
        toast.error("Update failed.");
      }
    },
  });
return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-6 px-6 sm:px-12 lg:px-16">
      <Toaster />
      <h2 className="text-3xl font-extrabold text-white text-center mb-10 tracking-wide">
        Site Settings
      </h2>

      {/* General Settings */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-3">
          General Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "Site Title", name: "siteTitle" },
            { label: "Currency", name: "siteCurrency" },
            { label: "Currency Symbol", name: "currencySymbol" },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="mb-2 text-sm font-medium text-gray-300 tracking-wide"
              >
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                className="bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Transfer Settings */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-3">
          Transfer Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Min Transfer", name: "transferMin" },
            { label: "Max Transfer", name: "transferMax" },
            { label: "Transfer Charge", name: "transferCharge" },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="mb-2 text-sm font-medium text-gray-300 tracking-wide"
              >
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                className="bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Trade Settings */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-3">
          Trade Settings
        </h3>
        {["30Second", "60Second", "3Min", "5Min"].map((time) => (
          <div key={time} className="mb-10">
            <h4 className="text-xl font-semibold text-white mb-6">
              Trade {time.replace(/([A-Z])/g, " $1").trim()}
            </h4>

            {time === "5Min" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["buy", "sell"].map((action) => (
                  <div key={action} className="bg-gray-700 p-2 rounded-md shadow-inner">
                    <p className="mb-4 text-gray-300 font-medium capitalize">{action}</p>
                    <label
                      htmlFor={`trade5min.${action}.tradeResult`}
                      className="block text-sm text-gray-300 mb-2"
                    >
                      Result
                    </label>
                    <select
                      id={`trade5min.${action}.tradeResult`}
                      name={`trade5min.${action}.tradeResult`}
                      value={formik.values.trade5min?.[action]?.tradeResult || ""}
                      onChange={formik.handleChange}
                      className="bg-gray-600 text-white p-3 rounded-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select result</option>
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                    </select>

                    <label
                      htmlFor={`trade5min.${action}.resultPercent`}
                      className="block text-sm text-gray-300 mt-6 mb-2"
                    >
                      Result Percent
                    </label>
                    <input
                      id={`trade5min.${action}.resultPercent`}
                      type="text"
                      name={`trade5min.${action}.resultPercent`}
                      value={formik.values.trade5min?.[action]?.resultPercent || ""}
                      onChange={formik.handleChange}
                      className="bg-gray-600 text-white p-3 rounded-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="e.g., 70%"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["buy", "sell"].map((action) => (
                  <div key={action} className="bg-gray-700 p-2 rounded-md shadow-inner">
                    <p className="mb-2 text-gray-300 font-medium capitalize">{action}</p>
                    <label
                      htmlFor={`trade${time}.${action}.tradeResult`}
                      className="block text-sm text-gray-300 mb-2"
                    >
                      Result
                    </label>
                    <select
                      id={`trade${time}.${action}.tradeResult`}
                      name={`trade${time}.${action}.tradeResult`}
                      value={formik.values[`trade${time}`]?.[action]?.tradeResult || ""}
                      onChange={formik.handleChange}
                      className="bg-gray-600 text-white p-3 rounded-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select result</option>
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                    </select>

                    <label
                      htmlFor={`trade${time}.${action}.resultPercent`}
                      className="block text-sm text-gray-300 mt-6 mb-2"
                    >
                      Result Percent
                    </label>
                    <input
                      id={`trade${time}.${action}.resultPercent`}
                      type="text"
                      name={`trade${time}.${action}.resultPercent`}
                      value={formik.values[`trade${time}`]?.[action]?.resultPercent || ""}
                      onChange={formik.handleChange}
                      className="bg-gray-600 text-white p-3 rounded-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="e.g., 70%"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Links Settings */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-2 mb-8">
        <h3 className="text-2xl font-semibold text-white mb-8 border-b border-gray-700 pb-3">
          Links Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Telegram Link", name: "telegramLink" },
            { label: "Email Link", name: "emailLink" },
            { label: "WhatsApp Link", name: "whatsappLink" },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="mb-2 text-sm font-medium text-gray-300 tracking-wide"
              >
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                className="bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center sticky bottom-0 w-full py-4">
        <button
          type="submit"
          onClick={formik.handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-4 px-12 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          Update Settings
        </button>
      </div>
    </div>
  );
};

export default SiteSetting;
