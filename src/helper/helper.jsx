import axios from "axios";
/** login function */
const baseURL = import.meta.env.VITE_BASE_URL;

// console.log("baserul", baseURL);
export async function registerUser(credentials) {
  try {
    const { data } = await axios.post(`${baseURL}/api/registerUser`, credentials);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error?.response?.data || { error: "Something went wrong" });
  }
}


export async function verifyPassword({ email, password }) {
  try {
    if (email) {
      const { data } = await axios.post(`${baseURL}/api/login`, {
        email,
        password,
      });
      return Promise.resolve({ data }); // Only return data on success
    }
  } catch (error) {
    // Check if there's a specific error message from the server
    const errorMessage = error.response?.data?.error || "An error occurred";
    console.log("Error ", errorMessage);
    return Promise.reject({ error: errorMessage });
  }
}

export async function verifyAdminPassword(id) {
  try {
    if (id) {
      const { data } = await axios.post(`${baseURL}/api/userLogin/${id}`);
      return Promise.resolve({ data }); // Only return data on success
    }
  } catch (error) {
    // Check if there's a specific error message from the server
    const errorMessage = error.response?.data?.error || "An error occurred";
    console.log("Error ", errorMessage);
    return Promise.reject({ error: errorMessage });
  }
}
export async function createCoin(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.post(`${baseURL}/api/createCoin`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
export async function updateCoin(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`${baseURL}/api/updateCoin`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

export async function deleteCoin(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`${baseURL}/api/deleteCoin`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Delete Profile...!" });
  }
}

export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`${baseURL}/api/updateUser`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
export async function updateUserByUser(response) {
  try {
    const token = await localStorage.getItem("uToken");
    const {data} = await axios.put(`${baseURL}/api/updateUserByUser`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
export async function updateUserPasswordByUser(response) {
  try {
    const token = await localStorage.getItem("uToken");
    const {data} = await axios.put(`${baseURL}/api/updateUserPasswordByUser`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

export async function updateAdminPassword(response) {
  try {
    const token = await localStorage.getItem("token");
    const {data} = await axios.put(`${baseURL}/api/updateAdminPassword`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
export async function updateSiteSetting(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`${baseURL}/api/updateSiteSetting`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}


export async function createDepositMethod(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.post(
      `${baseURL}/api/createDepositMethod`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}
export async function updateDepositMethod(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(
      `${baseURL}/api/updateDepositMethod`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

export async function deleteDepositMethod(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(
      `${baseURL}/api/deleteDepositMethod`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("this token", token);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Delete Profile...!" });
  }
}

export async function createWithdrawMethod(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.post(
        `${baseURL}/api/createWithdrawMethod`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
  }
  export async function updateWithdrawMethod(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.put(
        `${baseURL}/api/updateWithdrawMethod`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
  }
  
  export async function deleteWithdrawMethod(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.put(
        `${baseURL}/api/deleteWithdrawMethod`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Delete Profile...!" });
    }
  }

  // Create Trade

  export async function createTrade(response) {
    try {
      const token = await localStorage.getItem("uToken");
      const data = await axios.post(
        `${baseURL}/api/createTrade`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Create Trade...!" });
    }
  }

  // 
export async function createDeposit(response) {
  try {
    const token = localStorage.getItem("uToken");
    const { data } = await axios.post(
      `${baseURL}/api/createDeposit`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!data || !data.deposit || !data.deposit._id) {
      throw new Error("Invalid response structure");
    }

    return data; // ✅ Clean return
  } catch (error) {
    throw new Error("Couldn't Create Deposit...!");
  }
}
export async function createWithdraw(response) {
  try {
    const token = localStorage.getItem("uToken");
    const { data } = await axios.post(
      `${baseURL}/api/createWithdraw`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!data || !data.withdraw || !data.withdraw._id) {
      throw new Error("Invalid response structure");
    }

    return data; // ✅ Clean return
  } catch (error) {
    throw new Error("Couldn't Create Withdraw...!");
  }
}

export async function createTransfer(response) {
  try {
    const token = localStorage.getItem("uToken");
    const { data } = await axios.post(
      `${baseURL}/api/createTransfer`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!data || !data.transfer || !data.transfer._id) {
      throw new Error("Invalid response structure");
    }

    return data; // ✅ Clean return
  } catch (error) {
    throw new Error("Couldn't Create transfer...!");
  }
}
export async function createKyc(response) {
  try {
    const token = localStorage.getItem("uToken");
    const { data } = await axios.post(
      `${baseURL}/api/createKyc`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!data || !data.kyc || !data.kyc._id) {
      throw new Error("Invalid response structure");
    }

    return data; // ✅ Clean return
  } catch (error) {
    throw new Error("Couldn't Create Withdraw...!");
  }
}
 export async function updateDeposit(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.put(
        `${baseURL}/api/updateDeposit/${response?.id}`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
  }
 export async function updateKyc(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.put(
        `${baseURL}/api/updateKyc/${response?.id}`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
  }
 export async function updateWithdraw(response) {
    try {
      const token = await localStorage.getItem("token");
      const data = await axios.put(
        `${baseURL}/api/updateWithdraw/${response?.id}`,
        response,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("this token", token);
      return Promise.resolve({ data });
    } catch (error) {
      return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
  }