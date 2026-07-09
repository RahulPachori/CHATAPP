import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePatern from "../Components/AuthImagePatern";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageCircleMore,
} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) return;

    login(formData);
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
                Welcome to NexTalk
              </h1>

              <p className="text-base-content/60 mt-2">
                Sign in and continue your conversations.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Email
                </span>
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 z-10"
                />

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
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 z-10"
                />

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
                  onClick={() => setShowPassword(!showPassword)}
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
              disabled={isLoggingIn}
              className="btn btn-primary w-full rounded-xl h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="divider my-7"></div>

          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="link link-primary font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <AuthImagePatern
        title="Welcome Back!"
        subtitle="Continue chatting with friends and stay connected in real time."
      />
    </div>
  );
};

export default LoginPage;
