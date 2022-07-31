import { useEffect } from "react";
import { createContext, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "../firebase";
import AxiosInstance from "../API/api";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const auth = getAuth(firebaseApp);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [pronouns, setPronouns] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const getUserInfo = async (email) => {
    try {
      const { data } = await AxiosInstance.get(`/user/get-user-info`, {
        params: {
          email,
        },
      });
      if (data.result) {
        setPhoneNumber(data.phoneNumber);
        setPronouns(data.pronouns);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const rememberMe =
        localStorage.getItem("remember") === "true" ||
        sessionStorage.getItem("remember") === "true";
      setUser(user);
      setIsLoggedIn(!!user && rememberMe);
      setUserDataLoading(false);
      if (user) {
        getUserInfo(user.email);
        setName(user.displayName);
        setEmail(user.email);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, user]);

  auth.currentUser
    ?.getIdTokenResult()
    .then((idTokenResult) => {
      // Check if the user is an Admin.
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
        phoneNumber,
        pronouns,
        name,
        email,
        setName,
        setEmail,
        setPhoneNumber,
        setPronouns,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
