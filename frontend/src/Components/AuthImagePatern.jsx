const AuthImagePattern = ({ title, subtitle }) => {
   return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
         <div className="max-w-lg w-full space-y-10">

            {/* CHAT PREVIEW */}
            <div className="space-y-5">

               {/* LEFT */}
               <div className="flex justify-start">
                  <div className="bg-primary/15 px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm max-w-xs">
                     Hey there! 👋
                  </div>
               </div>

               {/* RIGHT */}
               <div className="flex justify-end">
                  <div className="bg-primary text-primary-content px-5 py-3 rounded-2xl rounded-br-sm shadow-sm max-w-xs">
                     Welcome to ChatSphere 💬
                  </div>
               </div>

               {/* LEFT */}
               <div className="flex justify-start">
                  <div className="bg-base-100 px-5 py-3 rounded-2xl shadow-sm max-w-xs">
                     Connect. Share. Enjoy 🚀
                  </div>
               </div>

               {/* IMAGE MESSAGE (FAKE) */}
               <div className="flex justify-end">
                  <div className="bg-base-100 p-2 rounded-2xl shadow-sm w-40">
                     <div className="w-full h-24 rounded-xl bg-primary/20 flex items-center justify-center text-3xl">
                        🌄
                     </div>
                     <p className="text-xs mt-1 text-center text-base-content/60">
                        Beautiful moments
                     </p>
                  </div>
               </div>

               {/* LEFT */}
               <div className="flex justify-start">
                  <div className="bg-primary/15 px-5 py-3 rounded-2xl shadow-sm max-w-xs">
                     Fast & Secure 🔒
                  </div>
               </div>

               {/* TYPING */}
               <div className="flex justify-end">
                  <div className="bg-base-100 px-4 py-3 rounded-2xl shadow-sm">
                     <div className="flex gap-1">
                        <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                     </div>
                  </div>
               </div>

            </div>

            {/* TEXT BELOW */}
            <div className="text-center">
               <h2 className="text-3xl font-bold mb-3">{title}</h2>
               <p className="text-base-content/60 leading-relaxed">
                  {subtitle}
               </p>
            </div>

         </div>
         
      </div>
   );
};

export default AuthImagePattern;
