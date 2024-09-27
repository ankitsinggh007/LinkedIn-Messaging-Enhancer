import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "./popup/components/Modal.tsx";
import aiIconPath from "../assets/ai-icon.jpg";
import "./popup/style.css";
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    console.log("Content script running on LinkedIn");

    // Create a state to track modal visibility
    let modalOpen = false;

    // Declare currentAiIcon to store the active AI icon element
    let currentAiIcon: HTMLElement | null = null;

    // Declare currentFocusedInput to store the focused message input field
    let currentFocusedInput: HTMLElement | null = null;

    // Create a Set to track elements with event listeners
    const observedInputs = new Set<HTMLElement>();

    // Function to open the modal
    const showModal = () => {
      if (currentFocusedInput) {
        modalOpen = true;
        renderModal();
      } else {
        console.log("No focused input field found.");
      }
    };

    // Function to close the modal
    const hideModal = () => {
      modalOpen = false;
      renderModal();
    };

    // Function to insert the AI message into the currently focused LinkedIn input
    const insertMessageIntoLinkedIn = (message: string) => {
      console.log("Current Focused Input:", currentFocusedInput); // Log current input for debugging
      if (currentFocusedInput) {
        const newMessage = document.createElement("p");
        newMessage.textContent = message;

        // Append the new message to the current focused input
        currentFocusedInput.appendChild(newMessage);
        currentFocusedInput.focus();

        // Dispatch input and change events to simulate user input
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        currentFocusedInput.dispatchEvent(inputEvent);
        const changeEvent = new Event("change", {
          bubbles: true,
          cancelable: true,
        });
        currentFocusedInput.dispatchEvent(changeEvent);
      } else {
        console.log("No focused input to insert the message.");
      }
    };

    // Function to render the modal
    const renderModal = () => {
      let modalRoot = document.getElementById("modal-root");
      if (!modalRoot) {
        modalRoot = document.createElement("div");
        modalRoot.id = "modal-root";
        document.body.appendChild(modalRoot); // Append modal root to body
      }

      const root = ReactDOM.createRoot(modalRoot);
      root.render(
        <Modal
          isOpen={modalOpen}
          onClose={hideModal}
          onInsert={insertMessageIntoLinkedIn}
        />
      );
    };

    // Function to inject the AI icon into the LinkedIn message area
    const injectAIIcon = (container) => {
      const aiIcon = document.createElement("img");
      aiIcon.id = "ai-icon";
      aiIcon.src = aiIconPath;
      aiIcon.alt = "AI Icon";

      // Style the icon
      aiIcon.style.position = "absolute";
      aiIcon.style.cursor = "pointer";
      aiIcon.style.width = "auto";
      aiIcon.style.height = "auto";
      aiIcon.style.objectFit = "contain";
      aiIcon.style.display = "none"; // Initially hidden

      container.appendChild(aiIcon);

      aiIcon.addEventListener("click", showModal);
      return aiIcon;
    };

    // Function to handle focus events and reposition AI icon
    const handleFocusEvents = () => {
      const messageInputs = document.querySelectorAll(
        'div[contenteditable="true"]'
      );

      messageInputs.forEach((input) => {
        const inputElement = input as HTMLElement;

        // Attach listeners only if not already observed
        if (!observedInputs.has(inputElement)) {
          observedInputs.add(inputElement); // Mark as observed

          inputElement.addEventListener("focus", () => {
            // Set the current focused input
            currentFocusedInput = inputElement;

            // Remove the current icon from the previous input field if any
            if (currentAiIcon) {
              currentAiIcon.remove();
            }

            // Inject the AI icon into the newly focused input field
            currentAiIcon = injectAIIcon(input.parentElement);
            currentAiIcon.style.display = "block";

            const rect = input.getBoundingClientRect();
            currentAiIcon.style.left = `${rect.width - 25}px`;
            currentAiIcon.style.top = `${rect.height - 25}px`;

            console.log("Message input focused, AI icon injected");
          });

          inputElement.addEventListener("blur", () => {
            console.log("Message input blur, AI icon removed");

            setTimeout(() => {
              if (currentAiIcon) {
                currentAiIcon.style.display = "none"; // Hide the icon when focus is lost
              }
            }, 100);
          });
        }
      });
    };

    // Create a MutationObserver to monitor for DOM changes
    const observer = new MutationObserver(handleFocusEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check for message input focus
    handleFocusEvents();
  },
});
