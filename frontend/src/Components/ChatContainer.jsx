import React, { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `NexTalk-${Date.now()}.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border border-base-300">
                  <img
                    src={
                      isMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <div className="chat-header text-xs opacity-60 mb-1 px-1">
                {formatMessageTime(message.createdAt)}
              </div>

              <div
                className={`chat-bubble flex flex-col rounded-3xl shadow-md ${isMe
                    ? "chat-bubble-primary"
                    : "bg-base-200 text-base-content"
                  }`}
              >
                {message.image && (
                  <div className="relative inline-block group mb-2">
                    <img
                      src={message.image}
                      alt="Attachment"
                      onClick={() => setPreviewImage(message.image)}
                      className="rounded-2xl max-w-[220px] sm:max-w-[280px] h-auto object-cover cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    />

                    <button
                      onClick={() => downloadImage(message.image)}
                      className="
                        absolute top-2 right-2
                        w-9 h-9
                        rounded-full
                        bg-base-100/70
                        backdrop-blur
                        text-base-content
                        flex items-center justify-center
                        opacity-0
                        group-hover:opacity-100
                        transition-all
                        hover:bg-base-100
                      "
                    >
                      <Download size={18} />
                    </button>
                  </div>
                )}

                {message.text && (
                  <p className="leading-relaxed break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </div>
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="btn btn-circle btn-sm absolute -top-4 -right-4 z-10"
            >
              <X size={18} />
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-3xl shadow-2xl"
            />

            <button
              onClick={() => downloadImage(previewImage)}
              className="btn btn-primary absolute bottom-4 right-4 gap-2 shadow-lg"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;