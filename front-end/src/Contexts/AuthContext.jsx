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
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const rememberMe =
        localStorage.getItem("remember") === "true" ||
        sessionStorage.getItem("remember") === "true";
      setUser(user);
      setIsLoggedIn(!!user && rememberMe);
      setUserDataLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, user]);

  auth.currentUser
    ?.getIdTokenResult()
    .then((idTokenResult) => {
      // Confirm the user is an Admin.
      if (!!idTokenResult.claims.admin) {
        // Show admin UI.
        setUserType("admin");
      } else {
        // Show regular user UI.
        setUserType("volunteer");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("remember");
    sessionStorage.removeItem("remember");
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        logout,
        user,
        userDataLoading,
        userType,
        setUserType,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
