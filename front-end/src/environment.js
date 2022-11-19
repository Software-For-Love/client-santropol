export const devFlag = process.env.NODE_ENV === "development";
export const backendServer = devFlag
  ? // "http://localhost:2000/"
    "http://localhost:2000"
  : "https://unique-terminus-353014.nn.r.appspot.com";
// ("https://unique-terminus-353014.nn.r.appspot.com");
