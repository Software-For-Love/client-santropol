import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );
  const [user, setUser] = useState(null);

  const login = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
