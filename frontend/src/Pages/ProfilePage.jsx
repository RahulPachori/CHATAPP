import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  CalendarDays,
  BadgeCheck,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    setSelectedImg(preview);

    const formData = new FormData();
    formData.append("profilePic", file);

    await updateProfile(formData);
  };
  return (
    <>
      <div className="min-h-screen pt-24 pb-10 bg-base-100">
        <div className="max-w-3xl mx-auto px-4">

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body p-8">

              

              <div className="flex flex-col items-center mb-6">

                <div className="relative group">

                  <img
                    src={
                      selectedImg ||
                      authUser?.profilePic ||
                      "/avatar.png"
                    }
                    alt="Profile"
                    onClick={() => setShowImageModal(true)}
                    className="w-52 h-52 rounded-full object-cover border-[6px] border-base-300 shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-105"
                  />

                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-2 right-3 btn btn-circle btn-primary btn-lg shadow-lg ${isUpdatingProfile
                        ? "pointer-events-none animate-pulse"
                        : ""
                      }`}
                  >
                    <Camera className="w-5 h-5" />

                    <input
                      id="avatar-upload"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>

                </div>

                <p className="text-sm text-base-content/60 mt-4">
                  {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the image to preview • Camera to change photo"}
                </p>

              </div>

              <div className="grid gap-5">

                <div className="rounded-xl bg-base-200 border border-base-300 px-5 py-3">

                  <div className="flex items-center gap-2 text-base-content/60 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Full Name</span>
                  </div>

                  <p className="font-semibold text-base">
                    {authUser?.fullName}
                  </p>

                </div>

                <div className="rounded-xl bg-base-200 border border-base-300 px-5 py-3">

                  <div className="flex items-center gap-2 text-base-content/60 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email Address</span>
                  </div>

                  <p className="font-semibold text-base">
                    {authUser?.email}
                  </p>

                </div>

              </div>

              <div className="divider my-2"></div>

              <div className="rounded-xl bg-base-200 border border-base-300 p-5">

                <h2 className="text-lg font-semibold mb-4">
                  Account Information
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-base-content/70">
                      <CalendarDays className="w-5 h-5" />
                      Member Since
                    </div>

                    <span className="font-medium">
                      {authUser?.createdAt?.split("T")[0]}
                    </span>

                  </div>

                  <div className="divider my-0"></div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-base-content/70">
                      <BadgeCheck className="w-5 h-5" />
                      Account Status
                    </div>

                    <div className="badge badge-success badge-outline px-4 py-3">
                      Active
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="btn btn-circle btn-sm absolute -top-4 -right-4 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={
                selectedImg ||
                authUser?.profilePic ||
                "/avatar.png"
              }
              alt="Profile"
              className="max-h-[85vh] max-w-[90vw] rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;