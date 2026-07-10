import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
   const {
      getUsers,
      users,
      selectedUser,
      setSelectedUser,
      isUsersLoading,
   } = useChatStore();

   const { onlineUsers } = useAuthStore();
   const [showOnlineOnly, setShowOnlineOnly] = useState(false);

   useEffect(() => {
      getUsers();
   }, [getUsers]);

   const filteredUsers = showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;

   if (isUsersLoading) return <SidebarSkeleton />;

   return (
      <aside className="h-full w-20 lg:w-80 bg-base-100 border-r border-base-200 flex flex-col">

         <div className="sticky top-0 z-10 bg-base-100 border-b border-base-200 px-6 py-5">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="size-5 text-primary" />
               </div>

               <div className="hidden lg:block">
                  <h2 className="font-semibold text-lg">Contacts</h2>
                  <p className="text-xs text-base-content/50">
                     {onlineUsers.length - 1} online
                  </p>
               </div>
            </div>

            <div className="mt-5 hidden lg:flex items-center gap-3">
               <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="toggle toggle-primary toggle-sm"
               />

               <span className="text-sm font-medium">
                  Show online only
               </span>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {filteredUsers.map((user) => (
               <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200
   hover:bg-base-200
   ${selectedUser?._id === user._id
                        ? "bg-primary/10 border border-primary/20"
                        : ""
                     }`}
               >
                  <div className="relative shrink-0">
                     <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.name}
                        className="size-12 rounded-full object-cover"
                     />

                     {onlineUsers.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-500 ring-2 ring-base-100" />
                     )}
                  </div>

                  <div className="hidden lg:flex flex-col items-start justify-center flex-1 min-w-0">
                     <h3 className="font-semibold text-base truncate w-full text-left">
                        {user.fullName || user.name}
                     </h3>

                     <span
                        className={`text-sm ${onlineUsers.includes(user._id)
                              ? "text-green-500"
                              : "text-base-content/50"
                           }`}
                     >
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                     </span>
                  </div>
               </button>
            ))}
         </div>
      </aside>
   );
};

export default SideBar;