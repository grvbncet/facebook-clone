import React from "react";
import api from "../api/axios.js"; // or wherever your Axios instance is
import useAuthStore from "../store/useAuthStore";

export const UpdateProfile = () => {
  const { user, getInitials, mobile } = useAuthStore();
  const [name, setName] = React.useState(user.name);
  const [phone, setPhone] = React.useState(user.phone);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    console.log("Save button clicked");
    try {
      console.log("Sending request...");

      const res = await api.patch("auth/profile/update", {
        name,
        email: user.email,
        phone,
        newPassword,
        confirmPassword,
      });
      console.log("Response:", res.data);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded shadow p-6 flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
          {getInitials(user.name)}
        </div>
        <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
      {/* Settings Form */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        <form action="" onSubmit={handleSaveSettings}>
          <div>
            <label className="block text-sm mb-1 font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full border px-3 py-2 rounded mb-4"
              required
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Phone</label>
            <input
              type="text"
              value={phone}
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium ">
              Change Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded gap-2 mb-4"
              placeholder="New Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded gap-2 mb-4"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export const Profile = () => {
  return <div>Profile</div>;
};
