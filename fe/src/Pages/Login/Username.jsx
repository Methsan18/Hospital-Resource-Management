import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/store";
import { verifyPassword, getUserData } from "../../helper/helper"; // ✅ add getUserData

const LoginPage = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const validate = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Username is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validate,
    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (values) => {
      setUsername(values.username);

      const loginPromise = verifyPassword(values);

      toast.promise(loginPromise, {
        loading: "Checking...",
        success: "Login successful",
        error: "Invalid username or password",
      });

      try {
        // backend returns { message, username, role, token }
        const res = await loginPromise;

        const { token, role, username } = res;

        // Patients are not allowed to login to dashboards
        if (role === "patient") {
          toast.error("Patients cannot log in to the dashboard");
          return;
        }

        // ✅ fetch full user to get _id (because your backend user routes use /:id)
        const fullUser = await getUserData(username);

        // store token and basic user info (include _id)
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: fullUser?._id,
            username,
            role,
          })
        );

        // navigate to the correct dashboard based on role
        switch (role) {
          case "admin":
            navigate("/admin/AdminDashboard");
            break;

          case "pharmacist":
            navigate("/Pharmacist/dashboard/PharmacistDashboard");
            break;

          case "store_manager":
            navigate("/Store_Manager/dashboard/StoreManagerDashboard");
            break;

          case "ward_nurse":
            navigate("/Ward_Nurse/dashboard/WardNurseDashboard");
            break;

          case "etu_nurse":
            navigate("/ETU_Nurse/dashboard/ETU_NurseDashboard");
            break;

          case "etu_head":
            navigate("/ETU_Head/dashboard/dashboard");
            break;

          case "opd_doc":
            navigate("/OPD_Doctor/dashboard/OPD_DocDashboard");
            break;

          case "etu_doc":
            navigate("/ETU_Doctor/dashboard/ETU_DocDashboard");
            break;

          case "methaRole":
            navigate("/Metha/dashboard/MethaRoleDashboard");
            break;

          default:
            navigate("/");
        }
      } catch (err) {
        toast.error("Login failed. Please check your credentials.");
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-blue-50">
      <Toaster position="top-center" />

      {/* LEFT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 bg-white shadow-md p-3 rounded-full hover:bg-blue-100"
        >
          <HiArrowLeft className="text-blue-700 text-xl" />
        </button>

        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Hospital Staff Login
          </h2>

          <form className="grid gap-4" onSubmit={formik.handleSubmit}>
            <input
              {...formik.getFieldProps("username")}
              placeholder="Username"
              className="input"
            />
            {formik.errors.username && (
              <p className="text-red-600 text-sm">{formik.errors.username}</p>
            )}

            <input
              {...formik.getFieldProps("password")}
              type="password"
              placeholder="Password"
              className="input"
            />
            {formik.errors.password && (
              <p className="text-red-600 text-sm">{formik.errors.password}</p>
            )}

            <button
              type="submit"
              className="mt-4 bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-500">
            <span>
              Not registered?{" "}
              <Link to="/registerForm" className="text-blue-800">
                Register Now
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT DECORATIVE PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-300 to-blue-500">
        <div className="text-white p-16 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg opacity-90">
            Securely access your hospital management dashboard.
          </p>
        </div>
      </div>

      <style>
        {`
          .input {
            border: 1px solid #cbd5e1;
            padding: 12px;
            border-radius: 10px;
            outline: none;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
