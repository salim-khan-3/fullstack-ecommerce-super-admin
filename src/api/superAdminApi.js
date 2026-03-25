import axios from "axios";

const API_URL = "https://fullstack-ecommerce-server-nine.vercel.app/api";

const getToken = () => localStorage.getItem("superAdminToken");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Login
export const superAdminLogin = async (email, password) => {
  const res = await axios.post(`${API_URL}/super-admin/login`, { email, password });
  return res.data;
};

// Get all admins
export const getAllAdmins = async () => {
  const res = await axios.get(`${API_URL}/super-admin/admins`, authHeaders());
  return res.data;
};

// Invite admin
export const inviteAdmin = async (email) => {
  const res = await axios.post(`${API_URL}/super-admin/invite-admin`, { email }, authHeaders());
  return res.data;
};

// Delete admin
export const deleteAdmin = async (id) => {
  const res = await axios.delete(`${API_URL}/super-admin/admin/${id}`, authHeaders());
  return res.data;
};

// Get stats
export const getSuperAdminStats = async () => {
  const res = await axios.get(`${API_URL}/super-admin/stats`, authHeaders());
  return res.data;
};

// Admin setup
export const adminSetup = async (email, token, name, password) => {
  const res = await axios.post(`${API_URL}/super-admin/admin-setup`, { email, token, name, password });
  return res.data;
};