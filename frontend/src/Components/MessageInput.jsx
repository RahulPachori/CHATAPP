import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import {
  Image,
  Send,
  X,
  Smile,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const { sendMessage } = useChatStore();
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if ((!text.trim() && !imagePreview) || isSending) return;

    const messageData = {
      text: text.trim(),
      image: imagePreview,
    };

    // Clear UI immediately
    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSending(true);

    try {
      await sendMessage(messageData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="border-t border-base-200 bg-base-100 px-4 py-3">

      {imagePreview && (
        <div className="mb-4">
          <div className="relative inline-block group">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-28 h-28 object-cover rounded-2xl border border-base-300 shadow-md"
            />

            <button
              type="button"
              onClick={removeImage}
              className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2"
            >
              <X size={14} />
            </button>

          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-end gap-3"
      >
        <div className="relative flex-1">

          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full rounded-full pr-28"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setShowEmojiPicker(false)}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">

            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
              title="Emoji"
            >
              <Smile size={19} />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`btn btn-ghost btn-circle btn-sm hover:bg-base-200 ${imagePreview ? "text-primary" : ""
                }`}
              title="Attach Image"
            >
              <Image size={19} />
            </button>

          </div>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-14 right-0 z-50 shadow-2xl rounded-2xl overflow-hidden"
            >
              <EmojiPicker
                theme="auto"
                lazyLoadEmojis
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{
                  showPreview: false,
                }}
                onEmojiClick={(emojiData) =>
                  setText((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSending}
          className="btn btn-primary btn-circle shadow-md hover:scale-105 transition-transform disabled:scale-100"
          title="Send"
        >
          {isSending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;