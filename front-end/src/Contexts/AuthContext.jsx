import { useEffect } from "react";
import { createContext, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "../firebase";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const auth = getAuth(firebaseApp);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, user]);

  const logout = () => {
    setIsLoggedIn(false);
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
