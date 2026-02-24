import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../helper/helper";
import styles from "../../styles/Username.module.css";
import extend from "../../styles/Profile.module.css";
import Header from "../../components/Navbar";
import avatar from "../../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const navigate = useNavigate();

  // ✅ logged in user object saved at login time
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?._id; // IMPORTANT: backend expects ID in /:id
  const username = storedUser?.username;

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!username) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Your helper likely fetches by username
    getUserData(username)
      .then((data) => {
        setUser(data);
        setFormData({
          // ✅ match your backend fields (register uses firstName/lastName/mobile/address)
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          mobile: data.mobile || "",
          address: data.address || "",
        });
      })
      .catch(() => toast.error("Failed to fetch user data"));
  }, [username, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const toggleChangePassword = () => {
    setChangePassword((prev) => !prev);
    setPasswords({ password: "", confirmPassword: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    if (changePassword) {
      if (!passwords.password.trim() || !passwords.confirmPassword.trim()) {
        toast.error("Please enter both password fields");
        return;
      }
      if (passwords.password !== passwords.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    // ✅ preserve role from fetched user
    const updateData = {
      ...formData,
      ...(changePassword ? { password: passwords.password } : {}),
      role: user?.role,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8070/api/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully");

      // refresh after update
      const updatedUser = await getUserData(username);
      setUser(updatedUser);
      setFormData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        mobile: updatedUser.mobile || "",
        address: updatedUser.address || "",
      });

      setChangePassword(false);
      setPasswords({ password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return <div className="text-xl text-center mt-10">Loading profile...</div>;
  }

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3140204/pexels-photo-3140204.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <Toaster position="top-center" />

      <div className="flex justify-center items-center min-h-[90vh] px-4 pt-24">
        <form
          onSubmit={handleSubmit}
          className={`${styles.glass} ${extend.glass} relative w-full max-w-4xl`}
          style={{
            padding: "2em",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {/* Greeting and Avatar */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Hello, {user?.firstName || user?.username} 👋
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Role: <span className="font-semibold">{user?.role}</span>
              </p>
            </div>

            <img
              src={user?.profile || avatar}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              alt="avatar"
            />
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white">
            <div>
              <label className="block mb-1 font-semibold" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="mobile">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Change password */}
          <div className="mt-8">
            <button
              type="button"
              onClick={toggleChangePassword}
              className="text-sm text-blue-200 hover:text-blue-400 underline"
            >
              {changePassword ? "Cancel Change Password" : "Change Password"}
            </button>

            {changePassword && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-semibold" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 font-semibold"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded px-3 py-2 text-black bg-gray-200 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-500 transition duration-200 text-white font-semibold px-6 py-2 rounded"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={logout}
              className="text-red-200 hover:text-red-500 font-semibold flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
