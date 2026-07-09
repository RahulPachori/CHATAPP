import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  MessageCircleMore,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../Components/AuthImagePatern";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim())
      return toast.error("Full name is required");

    if (!formData.email.trim())
      return toast.error("Email is required");

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return toast.error("Invalid email format");

    if (!formData.password)
      return toast.error("Password is required");

    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      signup(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-base-100 border border-base-300 shadow-xl rounded-3xl p-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 transition-transform duration-300 group-hover:scale-105">
                <MessageCircleMore
                  className="w-8 h-8 text-white"
                  strokeWidth={2.2}
                />
              </div>

              <h1 className="text-3xl font-bold mt-5">
                Join NexTalk
              </h1>

              <p className="text-base-content/60 mt-2">
                Create your account and start chatting.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Full Name
                </span>
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 z-10" />

                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered rounded-xl w-full pl-12"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Email
                </span>
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 z-10" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered rounded-xl w-full pl-12"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Password
                </span>
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 z-10" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered rounded-xl w-full pl-12 pr-12"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-base-content/50 hover:text-base-content transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-primary w-full rounded-xl h-12"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="divider my-7"></div>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <AuthImagePattern
        title="Join the NexTalk Community"
        subtitle="Create your account to connect with friends, share moments, and chat in real time."
      />
    </div>
  );
};

export default SignUpPage;





