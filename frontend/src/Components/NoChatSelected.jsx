import { MessageCircleMore, Sparkles } from "lucide-react";

const NoChatSelected = () => {
   return (
      <div className="flex-1 flex items-center justify-center bg-base-100">
         <div className="max-w-lg text-center px-8">

            <div className="flex justify-center mb-8">
               <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl animate-pulse"></div>

                  <div className="mx-auto w-18 h-18 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                     <MessageCircleMore
                        className="w-8 h-8 text-white"
                        strokeWidth={2.2}
                     />
                  </div>
               </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-3">
               Welcome to NexTalk
            </h1>

            <p className="text-base-content/60 text-lg leading-relaxed">
               Your conversations, beautifully organized.
               <br />
               Select a contact from the sidebar and start chatting instantly.
            </p>

            <div className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-base-200 shadow-sm">
               <Sparkles className="w-5 h-5 text-primary" />
               <span className="text-sm font-medium">
                  End-to-end real-time messaging
               </span>
            </div>

         </div>
      </div>
   );
};

export default NoChatSelected;