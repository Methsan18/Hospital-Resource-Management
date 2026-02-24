import axios from "axios";
import toast from "react-hot-toast";
import * as jwtDecode from 'jwt-decode';  // Import as namespace

axios.defaults.baseURL = "http://localhost:8070";

/** To get username from Token */
export function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Invalid Token");

  try {
    // Handle default export if present
    const decodeFn = jwtDecode.default || jwtDecode;
    const decoded = decodeFn(token);
    return decoded.username || decoded.sub || decoded;
  } catch (error) {
    throw new Error("Token decoding failed");
  }
}

/** authenticate function */
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

/** get User details */
export async function getUserData({ username }) {
  try {
    const { data } = await axios.get(`/api/users/${username}`);
    return { data };
  } catch (error) {
    return { error: "User not found...!" };
  }
}

/** register user function */
export async function registerUser(credentials) {
  try {
    const { data, status } = await axios.post(`/api/register`, credentials);

    const { username, email } = credentials;
    const msg = "Welcome! Your account has been created.";

    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return toast.success("Register successfully..!");
  } catch (error) {
    return toast.error("User Already Exist..!");
  }
}

/** login function */
export async function verifyPassword({ username, password, user }) {
  try {
    const { data } = await axios.post("/api/auth/login", {
      username,
      password,
      //role:'user'
    });
    return Promise.resolve( data );
  } catch (error) {
    console.log("Login error:", error.response?.data); // Add this to inspect backend message
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}



/** update user profile function */
export async function updateUser(userData) {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(`http://localhost:8070/api/users/${userData.username}`, userData, {
  headers: { Authorization: `Bearer ${token}` },
});

    return Promise.resolve({ data });
  } catch (err) {
      if (err.response) {
        console.error("Backend responded with:", err.response.status, err.response.data);
        toast.error(`Update failed: ${err.response.data || err.response.statusText}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error("No response from server");
      } else {
        console.error("Error setting up request:", err.message);
        toast.error("Request error");
      }
    }
}

/** generate OTP */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/users/generateOTP", { params: { username } });

    if (status === 201) {
      const { data: user } = await getUserData({ username });
      const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: user.email,
        text,
        subject: "Password Recovery OTP",
      });
    }

    toast.dismiss();
    return toast.success("OTP Generated Successfully");
  } catch (error) {
    return toast.error("OTP Not Generated");
  }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
  try {
    await axios.get("/api/users/verifyOTP", { params: { username, code } });
    return toast.success("OTP Verified Successfully");
  } catch (error) {
    return toast.error("OTP Not Verified");
  }
}

/** reset password */
export async function resetPassword({ username, password }) {
  try {
    await axios.put("/api/resetPassword", { username, password });
    return toast.success("Password Changed Successfully");
  } catch (error) {
    return toast.error("Password Changing Unsuccessful");
  }
}

// Get Users Data
export async function getUsers() {
  try {
    const { data } = await axios.get(`/api/users`);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// helper.jsx
/*export async function getUserData(username) {
  try {
    const response = await fetch(`http://localhost:8070/api/users/${username}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();
    return user;
  } catch (err) {
    throw err;
  }
}
*/


