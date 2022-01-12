import React from "react";

import { useState } from "react";
export default function Username({cookies,setCookie,removeCookie}) {
  
  const [name, setName] = useState('');
  function handleCookie() {
    setCookie("Username", name, {
      path: "/"
    });
  }
  return (
    <div className="Username">
      <h1>Username in cookies</h1>
      <input
         placeholder="name"
         value={name}
         onChange={(e) => setName(e.target.value)}
      />
      
       {cookies.Username}
      <button onClick={handleCookie}>Set Cookie</button>
    </div>
  );
}