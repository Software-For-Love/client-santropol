export const devFlag = process.env.NODE_ENV === "development";
export const backendServer = devFlag
  ? "http://localhost:2000/"
  : "https://santro.herokuapp.com/";
  "https://unique-terminus-353014.nn.r.appspot.com"
