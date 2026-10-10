import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// "Continue with Google" button + a small popup that asks for the account password
const GoogleAuthButton = ({ text = "signin_with" }) => {
  const buttonRef = useRef(null);
  const { googleLogin, finishGoogleLogin } = useAuthStore();

  const [pendingUser, setPendingUser] = useState(null); // set when we need the password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  // Draw Google's button once the Google script has loaded
  useEffect(() => {
    let timer;
    let tries = 0;

    const init = () => {
      if (!window.google) {
        if (tries++ < 50) timer = setTimeout(init, 100);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const user = await googleLogin(response.credential);
          if (user) setPendingUser(user);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text,
      });
    };

    init();
    return () => clearTimeout(timer);
  }, [googleLogin, text]);

  const isNewPassword = pendingUser && !pendingUser.hasPassword; // Google account without a password yet

  const handleSubmit = async () => {
    if (isNewPassword) {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim()))
        return toast.error("Username must be 3-20 characters: letters, numbers or underscore");
      if (password.length < 6) return toast.error("Password must be at least 6 characters");
      if (password !== confirm) return toast.error("Passwords do not match");
    }
    setBusy(true);
    try {
      await finishGoogleLogin(pendingUser, password, username);
      setPendingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not unlock your messages");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div ref={buttonRef} className="flex justify-center" />

      {pendingUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {isNewPassword ? "Set up your account" : "Enter your password"}
            </h3>
            <p className="py-3 text-sm text-base-content/70">
              {isNewPassword
                ? "Choose a username and a password. The password lets you log in with your email later, and it also protects your encrypted messages. If you forget it, your messages cannot be recovered."
                : "Enter your account password to unlock your messages on this device."}
            </p>

            {isNewPassword && (
              <input
                type="text"
                className="input input-bordered w-full mb-3"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isNewPassword && (
              <input
                type="password"
                className="input input-bordered w-full mt-3"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            )}

            <div className="modal-action">
              <button className="btn" onClick={() => setPendingUser(null)} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={busy || !password || (isNewPassword && !username)}>
                {busy ? "Please wait..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
