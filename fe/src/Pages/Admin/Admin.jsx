import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineTrash, HiOutlineDownload, HiOutlineSearch } from "react-icons/hi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/HospitalUsers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8070/api/delete/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- CSV DOWNLOAD ---------- */
  const downloadCSV = () => {
    const headers = [
      "Username",
      "Email",
      "Role",
      "First Name",
      "Last Name",
      "Mobile",
      "Address"
    ];

    const rows = users.map((u) => [
      u.username,
      u.email,
      u.role,
      u.firstName || "",
      u.lastName || "",
      u.mobile || "",
      u.address || ""
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hospital_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">
          System Users Management
        </h1>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <HiOutlineDownload size={20} />
          Download User Data
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 w-96">
        <HiOutlineSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded w-full"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">{user.firstName || "-"}</td>
                <td className="p-3">{user.lastName || "-"}</td>
                <td className="p-3">{user.mobile || "-"}</td>
                <td className="p-3">{user.address || "-"}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                  >
                    <HiOutlineTrash size={22} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
