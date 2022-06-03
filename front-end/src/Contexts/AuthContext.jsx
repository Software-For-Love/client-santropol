import { useEffect } from "react";
import { createContext, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "../firebase";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const auth = getAuth(firebaseApp);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(!!user);
      setUserDataLoading(false);
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
    <AuthContext.Provider value={{ isLoggedIn, logout, user, userDataLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
