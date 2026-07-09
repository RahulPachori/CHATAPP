import { useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
   const { selectedUser, setSelectedUser } = useChatStore();
   const { onlineUsers } = useAuthStore();

   const [showImagePreview, setShowImagePreview] = useState(false);

   const isOnline = onlineUsers.includes(selectedUser._id);

   return (
      <>
         <div className="h-20 px-6 border-b border-base-200 bg-base-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <img
                     src={selectedUser.profilePic || "/avatar.png"}
                     alt={selectedUser.fullName}
                     onClick={() => setShowImagePreview(true)}
                     className="w-12 h-12 rounded-full object-cover border-2 border-base-200 cursor-pointer transition-transform duration-200 hover:scale-105"
                  />

                  <span
                     className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-base-100 ${isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                  />
               </div>

               <div>
                  <h2 className="font-semibold text-lg leading-none">
                     {selectedUser.fullName}
                  </h2>

                  <p
                     className={`text-sm mt-1 ${isOnline
                           ? "text-green-500"
                           : "text-base-content/50"
                        }`}
                  >
                     {isOnline ? "Online" : "Offline"}
                  </p>
               </div>
            </div>

            <button
               onClick={() => setSelectedUser(null)}
               className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
               title="Close chat"
            >
               <X className="w-5 h-5" />
            </button>
         </div>

         {/* Image Preview Modal */}
         {showImagePreview && (
            <div
               className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
               onClick={() => setShowImagePreview(false)}
            >
               <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
               >
                  <button
                     onClick={() => setShowImagePreview(false)}
                     className="btn btn-circle btn-sm absolute -top-4 -right-4 z-10"
                  >
                     <X className="w-4 h-4" />
                  </button>

                  <img
                     src={selectedUser.profilePic || "/avatar.png"}
                     alt={selectedUser.fullName}
                     className="max-h-[90vh] max-w-[90vw] rounded-3xl shadow-2xl"
                  />
               </div>
            </div>
         )}
      </>
   );
};

export default ChatHeader;

