import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { clearAuthData, getUser } from "./api";

function App() {
  const [user, setUser] = useState(getUser());

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;