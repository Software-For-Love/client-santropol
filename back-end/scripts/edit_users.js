const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
require("dotenv").config()
let adminConfig = {
  type: process.env.ADMIN_ACC_TYPE,
  project_id: process.env.NODE_APP_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_CERTL_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_CERT_URL  
}

let app = initializeApp({
  credential: cert(adminConfig)
});

//Won't use this, but maybe down the line. However, can just query for events for each user depending on status
const db = getFirestore()
const list = db.collection("user").listDocuments().then(
  listofDocs =>{
    listofDocs.forEach(val => {
      db.collection("user").doc(val.id).update({
        cancelled_events: null,
        completed_events: null
      })
    })
  }
)






