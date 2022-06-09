const convertFirebaseErrorCodeToMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/user-not-found":
      return "User not found";
    case "auth/wrong-password":
      return "Wrong password";
    default:
      return "Unknown error";
  }
};

export default convertFirebaseErrorCodeToMessage;
