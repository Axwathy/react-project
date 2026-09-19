import { useState, useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState("");
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
useEffect(() => {
  const savedBookmarks =
    JSON.parse(localStorage.getItem("bookmarks")) || [];

  setBookmarks(savedBookmarks);
}, []);


  function handleSignup(event) {
    event.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    console.log("User saved:", user);
  }

  function handleLogin(event) {
    event.preventDefault();

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!savedUser) {
      alert("No user found. Please signup first.");
      return;
    }

    if (
      loginEmail === savedUser.email &&
      loginPassword === savedUser.password
    ) {
      alert("Login successful!");
      setIsLoggedIn(true);
    } else {
      alert("Invalid email or password");
    }
  }
function handleAddBookmark(event) {
  event.preventDefault();

  if (!bookmarkTitle || !bookmarkUrl) {
    alert("Please enter title and URL");
    return;
  }

  const bookmark = {
  title: bookmarkTitle,
  url: bookmarkUrl,
  addedTime: new Date().toLocaleString()
};

  const existingBookmarks =
  JSON.parse(localStorage.getItem("bookmarks")) || [];

if (existingBookmarks.length >= 5) {
  alert("You can only add 5 bookmarks.");
  return;
}

existingBookmarks.push(bookmark);

localStorage.setItem(
  "bookmarks",
  JSON.stringify(existingBookmarks)
);

setBookmarks(existingBookmarks);

alert("Bookmark added!");

setBookmarkTitle("");
setBookmarkUrl("");
}
function handleDeleteBookmark(index) {
  const updatedBookmarks = bookmarks.filter(
    (bookmark, bookmarkIndex) => bookmarkIndex !== index
  );

  setBookmarks(updatedBookmarks);

  localStorage.setItem(
    "bookmarks",
    JSON.stringify(updatedBookmarks)
  );
}
function handleEditBookmark(index) {
  const bookmark = bookmarks[index];

  setBookmarkTitle(bookmark.title);
  setBookmarkUrl(bookmark.url);
  setEditingIndex(index);
}
function handleUpdateBookmark(event) {
  event.preventDefault();

  if (!bookmarkTitle || !bookmarkUrl) {
    alert("Please enter title and URL");
    return;
  }

  const updatedBookmarks = [...bookmarks];
updatedBookmarks[editingIndex] = {
  title: bookmarkTitle,
  url: bookmarkUrl,
  addedTime: bookmarks[editingIndex].addedTime
};

  setBookmarks(updatedBookmarks);

  localStorage.setItem(
    "bookmarks",
    JSON.stringify(updatedBookmarks)
  );

  setBookmarkTitle("");
  setBookmarkUrl("");
  setEditingIndex(null);

  alert("Bookmark updated!");
}
    if (isLoggedIn) {

  const bookmarksPerPage = 2;
  const filteredBookmarks = bookmarks.filter((bookmark) =>
  bookmark.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase()) ||
  bookmark.url
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

const startIndex = (currentPage - 1) * bookmarksPerPage;

const currentBookmarks = filteredBookmarks
  .map((bookmark, index) => ({
    ...bookmark,
    originalIndex: bookmarks.indexOf(bookmark)
  }))
  .slice(
    startIndex,
    startIndex + bookmarksPerPage
  );
  return (
    <div>
      <h1>Personal Bookmarking Site</h1>

      <h2>Welcome to your Dashboard</h2>

      <button onClick={() => setIsLoggedIn(false)}>
        Logout
      </button>

      <hr />

      <h2>Add Bookmark</h2>

      <form
  onSubmit={
    editingIndex === null
      ? handleAddBookmark
      : handleUpdateBookmark
  }
>
        <input
          type="text"
          placeholder="Bookmark title"
          value={bookmarkTitle}
          onChange={(event) =>
            setBookmarkTitle(event.target.value)
          }
        />

        <br />
        <br />

        <input
          type="url"
          placeholder="Bookmark URL"
          value={bookmarkUrl}
          onChange={(event) =>
            setBookmarkUrl(event.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
  {editingIndex === null ? "Add Bookmark" : "Update Bookmark"}
</button>
      </form>
      <hr />

<h2>Your Bookmarks</h2>
<input
  type="text"
  placeholder="Search bookmarks..."
  value={searchTerm}
  onChange={(event) => {
  setSearchTerm(event.target.value);
  setCurrentPage(1);
}}
/>

{bookmarks.length === 0 ? (
  <p>No bookmarks yet.</p>
) : (
  <div>
    {currentBookmarks.map((bookmark) => (
  <div key={bookmark.originalIndex}>
          <h3>{bookmark.title}</h3>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookmark.url}
      </a>

      <p>Added: {bookmark.addedTime}</p>

      <br />

      <button
  onClick={() =>
    handleEditBookmark(bookmark.originalIndex)
  }
>
  Edit
</button>
<button
  onClick={() =>
    setConfirmDeleteIndex(bookmark.originalIndex)
  }
>
  Delete
</button>
      <hr />
          </div>
    ))}
  </div>
)}

{confirmDeleteIndex !== null && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <p>Are you sure you want to delete this bookmark?</p>
      <button
        onClick={() => {
          handleDeleteBookmark(confirmDeleteIndex);
          setConfirmDeleteIndex(null);
        }}
      >
        Yes, delete
      </button>
      <button onClick={() => setConfirmDeleteIndex(null)}>
        Cancel
      </button>
    </div>
  </div>
)}

<div>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span> Page {currentPage} </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
   disabled={
  currentPage * bookmarksPerPage >= filteredBookmarks.length
}
  >
    Next
  </button>
</div>

    </div>
  );
}

  return (
    <div>
      <h1>Personal Bookmarking Site</h1>

      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Signup</button>
      </form>

      <hr />

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter your password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;