import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { adminSetup } from "../../api/superAdminApi";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await adminSetup(email, token, data.name, data.password);
      toast.success("Account setup complete! Please login to admin dashboard.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <p className="text-red-400 font-bold text-lg">Invalid invite link!</p>
          <p className="text-slate-400 text-sm mt-2">Please request a new invitation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-2xl">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-1">Setup Your Account</h2>
          <p className="text-slate-400 text-sm text-center mb-2">You've been invited as Admin</p>
          <p className="text-blue-400 text-sm text-center font-medium mb-8">{email}</p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3.5 px-4 text-sm text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder-slate-500"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3.5 pl-4 pr-12 text-sm text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder-slate-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl py-3.5 pl-4 pr-12 text-sm text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder-slate-500"
                  {...register("confirmPassword", { required: "Please confirm password" })}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {watch("confirmPassword") && (
                <p className={`text-xs mt-1 ml-1 ${watch("password") === watch("confirmPassword") ? "text-green-400" : "text-red-400"}`}>
                  {watch("password") === watch("confirmPassword") ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm"
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;