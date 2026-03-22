import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllAdmins, getSuperAdminStats, inviteAdmin, deleteAdmin } from "../../api/superAdminApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Users, ShieldCheck, UserPlus, LogOut,
  Trash2, Mail, Clock, CheckCircle, Send
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ totalAdmins: 0, totalUsers: 0, pendingAdmins: 0 });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [adminsRes, statsRes] = await Promise.all([getAllAdmins(), getSuperAdminStats()]);
      setAdmins(adminsRes.admins);
      setStats(statsRes.stats);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return toast.error("Please enter an email");
    setInviteLoading(true);
    try {
      await inviteAdmin(inviteEmail);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} as Admin?`)) return;
    setDeleteLoading(id);
    try {
      await deleteAdmin(id);
      toast.success(`${name} removed as Admin`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove admin");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      <nav className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Super Admin Panel</h1>
              <p className="text-slate-400 text-xs">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Admins", value: stats.totalAdmins, icon: ShieldCheck, color: "blue" },
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "green" },
            { label: "Pending Invites", value: stats.pendingAdmins, icon: Clock, color: "yellow" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Admin */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-bold">Invite New Admin</h2>
          </div>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Enter admin email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={inviteLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl transition-all active:scale-[0.98] text-sm whitespace-nowrap"
            >
              <Send size={16} />
              {inviteLoading ? "Sending..." : "Send Invite"}
            </button>
          </form>
        </div>

        {/* Admin List */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-bold">Admin List</h2>
            <span className="ml-auto bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
              {admins.length} Admins
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No admins yet. Invite someone!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.id}
                  className="flex items-center justify-between bg-[#0f172a] border border-[#334155] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {admin.name ? admin.name.charAt(0).toUpperCase() : <Mail size={16} />}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {admin.name || "Pending Setup"}
                      </p>
                      <p className="text-slate-400 text-xs">{admin.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status */}
                    {admin.isVerified ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(admin.id, admin.name || admin.email)}
                      disabled={deleteLoading === admin.id}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;