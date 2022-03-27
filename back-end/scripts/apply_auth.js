 require("dotenv").config({path: '../.env.development.local/dev.env'});
 const { initializeApp ,cert} = require('firebase-admin/app');
 const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs')
const { parse } = require('csv-parse')

// Set admin privilege on the user corresponding to uid.
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
// const user = getAuth().set("floriane@santropolroulant.org").then(val => console.log(val)).catch(err => console.log(err))
// .setCustomUserClaims('18UphyVWxZXb5E0U8vBGAmjUuDp2', { staff: true })
//   .then(() => {
//     console.log("sucess");
//   })
//   .catch(err=> console.log(err));
function handleData(data){
  // console.log(data)
   parse(data, {columns: false, trim: true}, function(err, rows) {  //THIS IS BROKEN???
    // Your CSV data is in an array of arrys passed to this callback as rows.
    // console.log(JSON.parse());
    console.log(rows)
    let roleIndex = rows[1].length -1 ;
    for(var i=0; i < rows.length; i++){
      let currRole = (rows[i][roleIndex]);
      if(!currRole){
        // getAuth()
        // .setCustomUserClaims(rows[i][0], {role : volunteer })
        // .then(() => {
        //   // The new custom claims will propagate to the user's ID token the
        //   // next time a new one is issued.
        // });
        console.log(currRole + "this is undefined person" + rows[i][1])

      }
      else {
        console.log(JSON.parse(currRole))
      }

    }
    
  })
}
async function applyRole(){
  const data = await fs.promises.readFile(inputPath, 'utf8' );
  return data;

}

applyRole().then(val => {
  handleData(val)}).catch(err => console.log);
//  fs.readFile(inputPath,  function (err, fileData) {
  // parse(fileData, {columns: false, trim: true}, function(err, rows) {
  //   // Your CSV data is in an array of arrys passed to this callback as rows.
  //   // console.log(JSON.parse());
  //   console.log(rows)
  //   let roleIndex = rows[1].length -1 ;
  //   for(var i=0; i < rows.length; i++){
  //     let currRole = (rows[i][roleIndex]);
  //     if(!currRole){
  //       // getAuth()
  //       // .setCustomUserClaims(rows[i][0], {role : volunteer })
  //       // .then(() => {
  //       //   // The new custom claims will propagate to the user's ID token the
  //       //   // next time a new one is issued.
  //       // });
  //       console.log(currRole + "this is undefined person" + rows[i][1])

  //     }
  //     else {
  //       console.log(JSON.parse(currRole))
  //     }

  //   }
    
  // })
// })

