import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageCircleMore, Palette } from "lucide-react";

const NavBar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-base-100/90 backdrop-blur-xl border-b border-base-200 shadow-sm">
      <div className="w-full h-[72px] px-8">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <MessageCircleMore className="w-8 h-8 text-white" strokeWidth={2.2} />
            </div>

            <div className="flex flex-col leading-none">
              <h1 className="text-2xl font-semibold tracking-tight">
                NexTalk
              </h1>
              <span className="text-xs text-base-content/50">
                The Next Conversation
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="btn btn-ghost btn-circle hover:bg-base-200"
              title="Themes"
            >
              <Palette className="w-5 h-5" />
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-base-200 transition-all"
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
                  />

                  <div className="hidden sm:flex flex-col">
                    <span className="font-semibold leading-none">
                      {authUser.fullName}
                    </span>
                    <span className="text-xs text-green-500">
                      Online
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="btn btn-ghost rounded-xl gap-2 hover:bg-error hover:text-error-content transition-all"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;