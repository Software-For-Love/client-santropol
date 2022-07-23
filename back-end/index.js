require("dotenv").config();
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const firebase = require("firebase/app");
const app = express();
const port = process.env.PORT || 5000;
const indexRouter = require("./routes/routes");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const verifyToken = require("./middlewares/verifyToken");
const cors = require("cors");
const firebaseConfig = {
  apiKey: process.env.NODE_APP_API_KEY,
  authDomain: process.env.NODE_APP_AUTH_DOMAIN,
  projectId: process.env.NODE_APP_PROJECT_ID,
  storageBucket: process.env.NODE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NODE_APP_MESSAGING_SENDER_ID,
  appId: process.env.NODE_APP_APP_ID,
  measurementId: process.env.NODE_APP_MEAUSERMENT_ID,
};

const adminConfig = {
  type: process.env.ADMIN_ACC_TYPE,
  project_id: process.env.NODE_APP_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_CERTL_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_CERT_URL,
};

initializeApp({
  credential: cert(adminConfig),
});
firebase.initializeApp(firebaseConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(verifyToken);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
