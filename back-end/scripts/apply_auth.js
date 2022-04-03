 require("dotenv").config({path: '../.env.development.local/dev.env'});
 const { initializeApp ,cert} = require('firebase-admin/app');
 const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs')
const { parse } = require('csv-parse');


const inputPath = path.join(__dirname, "../export_users/old_users.csv");
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
  client_x509_cert_url: process.env.ADMIN_CLIENT_CERT_URL
};
const cred = cert(adminConfig);
const app = initializeApp({
  credential: cred
});
counter = 0;
userData = null;

function handleData(data){
    parse(data, {columns: false, trim: true,relax:true, relax_quotes: true}, function(err, rows) {  
    userData = rows[counter];
    let timeValue = setInterval(function(){
      applyRole(userData)
      counter++;
      console.log("here?" + counter)
      if(counter == rows.length){
        clearInterval(timeValue);
      } else {
        userData = rows[counter];
      }
    },
      250 //Need to have interval because Firebase has limit on number of auth requests
      
    )

  })
}


async function readCsv(){
  const data = await fs.promises.readFile(inputPath, 'utf8' );
  return data;

}

function applyRole(userInfo){
    let currRole = userInfo[userInfo.length-2]
    let userId  = userInfo[0];
    if(!currRole){
    getAuth()
    .setCustomUserClaims(userId, {role : "volunteer" })
    .then(() => {
    }).catch(err => console.log(err)) ;
  }
  else {
    let role = JSON.parse(currRole);
    getAuth()
    .setCustomUserClaims(userId, role)
    .then(() => {
    }).catch(err => console.log(err)) ;
  }
    

}


readCsv().then(val => {
  handleData(val)
}).catch(err => console.log(err));

