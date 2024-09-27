import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (message: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);

  console.log("i am inside modal");
  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable background scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable background scroll
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Close modal when clicking outside the form
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Update messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" }, // User message
      {
        text: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask",
        sender: "ai",
      },
    ]);

    setInputValue(""); // Clear the input
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(messages, "message");

    const lastResponse = messages[messages.length - 1]?.text;
    console.log(lastResponse);
    onInsert(lastResponse);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-md shadow-md w-[30%] min-w-[230px] relative flex flex-col">
        <div className="max-h-[300px] overflow-y-auto flex flex-col mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "ai"
                  ? "self-start bg-blue-100"
                  : "self-end bg-gray-200"
              } 
    text-black p-2 rounded-md mb-2 max-w-[75%] break-words flex
  `}
            >
              {message.text}
            </div>
          ))}
        </div>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            id="inputField"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-lightgray rounded-lg shadow-sm outline-none transition duration-200 focus:border-blue-500"
            placeholder="Your prompt"
          />

          <div className="flex gap-2">
            {messages.length > 0 &&
              messages[messages.length - 1].sender === "ai" && (
                <button
                  className="py-2 px-4 border border-black rounded-lg bg-transparent cursor-pointer flex items-center justify-center"
                  onClick={handleInsert}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="mr-2"
                  >
                    <path d="M10 15L15 10H5L10 15Z" fill="currentColor" />
                  </svg>
                  Insert
                </button>
              )}

            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-blue-700"
              onClick={handleSubmit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ marginRight: "0.5rem" }} // Space between icon and text
              >
                <path d="M2 2L20 10L2 18L4 10L2 2Z" fill="currentColor" />
              </svg>
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
