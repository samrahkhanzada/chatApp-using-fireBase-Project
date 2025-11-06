import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSLilMjJ1zWlIwwJ5_dUds8TCrF8WAObE",
  authDomain: "auth-and--database.firebaseapp.com",
  databaseURL: "https://auth-and--database-default-rtdb.firebaseio.com",
  projectId: "auth-and--database",
  storageBucket: "auth-and--database.firebasestorage.app",
  messagingSenderId: "719444327753",
  appId: "1:719444327753:web:4d1c2632c09e809ee36e98",
  measurementId: "G-1KWVRPQKL0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Auth functions
function handleAuthError(error) {
  swal("Error!", error.message, "error");
  console.error(error);
}

// SweetAlert confirmation function
async function confirmAction(title, text, confirmButtonText = "Yes") {
  return swal({
    title: title,
    text: text,
    icon: "warning",
    buttons: {
      cancel: {
        text: "Cancel",
        value: false,
        visible: true,
      },
      confirm: {
        text: confirmButtonText,
        value: true,
      },
    },
    dangerMode: true,
  });
}

// SweetAlert prompt function
async function promptMessage(title, text, placeholder = "") {
  return swal({
    title: title,
    text: text,
    content: {
      element: "input",
      attributes: {
        placeholder: placeholder,
        type: "text",
      },
    },
    buttons: {
      cancel: {
        text: "Cancel",
        value: null,
        visible: true,
      },
      confirm: {
        text: "OK",
        value: true,
      },
    },
  });
}

// Sign Up
document.getElementById("signUp")?.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    swal("Oops!", "Please fill in all required fields", "warning");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      swal("Success!", "SignUp Successfully ✅", "success").then(() => {
        window.location.href = "chat.html";
      });
    })
    .catch(handleAuthError);
});

// Login
document.getElementById("login")?.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    swal("Oops!", "Please fill in email and password", "warning");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      swal("Success!", "Login Successfully ✅", "success").then(() => {
        window.location.href = "chat.html";
      });
    })
    .catch(handleAuthError);
});

// Google Sign In
document.getElementById("google-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then(() => {
      swal("Success!", "Login Successfully ✅", "success").then(() => {
        window.location.href = "chat.html";
      });
    })
    .catch(handleAuthError);
});

// Logout
document.getElementById("logOut")?.addEventListener("click", () => {
  confirmAction("Logout", "Are you sure you want to logout?", "Logout").then(
    (willLogout) => {
      if (willLogout) {
        signOut(auth)
          .then(() => {
            swal("Success!", "LogOut Successfully ✅", "success").then(() => {
              window.location.href = "index.html";
            });
          })
          .catch(handleAuthError);
      }
    }
  );
});

// Send Message
// Send Message
window.sendBtn = function () {
  const messageInput = document.getElementById("int");
  const message = messageInput.value.trim();

  if (message) {
    const currentUser = auth.currentUser;
    const userName =
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "You";

    push(ref(db, "chat-msg"), {
      text: message,
      time: new Date().toISOString(),
      userId: currentUser?.uid,
      userName: userName,
    });
    messageInput.value = "";

    // Close emoji picker if it exists
    const emojiPicker = document.getElementById("emojiPicker");
    const emojiButton = document.getElementById("emojiButton");
    if (emojiPicker && emojiButton) {
      emojiPicker.classList.remove("show");
      emojiButton.classList.remove("active");
    }
  }
};
// Display Messages
onChildAdded(ref(db, "chat-msg"), function (snapshot) {
  const data = snapshot.val();
  const key = snapshot.key;
  const messagesContainer = document.getElementById("messagesContainer");

  if (!data.text) return; // Skip if no text

  const currentUser = auth.currentUser;
  const isCurrentUser = data.userId === currentUser?.uid;

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isCurrentUser ? "sent" : "received");
  messageElement.setAttribute("data-key", key);

  if (isCurrentUser) {
    // Sent message
    messageElement.innerHTML = `
      <div class="message-actions">
        <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
      </div>
      <div class="message-header">
        <div class="message-avatar" style="background: #8b5cf6;">
          <i class="fas fa-user"></i>
        </div>
        <div class="message-sender">You</div>
      </div>
      <p>${data.text}</p>
      <div class="message-time">${formatTime(new Date(data.time))}</div>
    `;
  } else {
    // Received message
    messageElement.innerHTML = `
      <div class="message-header">
        <div class="message-avatar" style="background: #10b981;">
          <i class="fas fa-user"></i>
        </div>
        <div class="message-sender">${data.userName || "Other User"}</div>
      </div>
      <p>${data.text}</p>
      <div class="message-time">${formatTime(new Date(data.time))}</div>
    `;
  }

  messagesContainer.appendChild(messageElement);

  // edit and delete
  if (isCurrentUser) {
    const editBtn = messageElement.querySelector(".edit-btn");
    const deleteBtn = messageElement.querySelector(".delete-btn");
    const messageText = messageElement.querySelector("p");

    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit your message:", data.text);
      if (newText && newText.trim() !== "") {
        update(ref(db, "chat-msg/" + key), { text: newText })
          .then(() => {
            messageText.textContent = newText;
          })
          .catch(handleAuthError);
      }
    });

    deleteBtn.addEventListener("click", () => {
      confirmAction(
        "Delete Message",
        "Are you sure you want to delete this message?",
        "Delete"
      ).then((willDelete) => {
        if (willDelete) {
          remove(ref(db, "chat-msg/" + key))
            .then(() => {
              messageElement.remove();
              swal("Deleted!", "Your message has been deleted.", "success");
            })
            .catch(handleAuthError);
        }
      });
    });
  }
});

// time function
function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}

// Add Enter key functionality for sending messages
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("int");

  if (messageInput) {
    messageInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        sendBtn(); // Call your existing send function
      }
    });
  }
});
