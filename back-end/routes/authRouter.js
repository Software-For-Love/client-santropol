const express = require('express');
const authRouter = express.Router();
var Airtable = require('airtable');

const firebase = require("firebase/app");
const  {getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIR_TABLE_API
});
    
var airTableBase = Airtable.base('appB7a5gvGu8ELiEp');


authRouter.post('/register', async(req,res)=>{
    const username = req.query.username;
    const password = req.query.password;
    console.log(`User register [username]: ${username} [password]: ${password}`);
    if(username.indexOf('@softwareforlove.com') != -1){
        var result = await signUpWithEmailPassword(username,password,res,{});
        return result;
    }
    else{
        airTableBase('👥 Volunteers').select(
            {fields:['Courriel'],
            filterByFormula:`({Courriel}=\"${username}\")`}
            ).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    res.json({result: 'User already exists', userDetail: record});
                });
                fetchNextPage();
            }, function done(err) {
                if (err) { console.error(err); return; }
                res.json({result:'User not found'},error);
            });
    }

    
});


authRouter.post('/signIn', async(req,res)=>{
    const username = req.query.username;
    const password = req.query.password;
    if(username.indexOf('@softwareforlove.com') != -1){
       let result = await signInWithEmailPassword(username,password,res,{});
    }
    else{
        airTableBase('👥 Volunteers').select(
            {fields:['Courriel'],
            filterByFormula:`({Courriel}=\"${username}\")`}
            ).eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record) {
                    signInWithEmailPassword(username,password,res,record);
                });
                fetchNextPage();
            
            }, function done(err) {
                if (err) { console.error(err); return; }
                let success = false;
                res.json({success, result:'User not found'});
    
            });
    }
    
});

async function signInWithEmailPassword(email,password,res,record) {
    // [START auth_signin_password]
    const auth = getAuth();
    await signInWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        res.json({user});

        // ...
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        res.json(error)
        return {error,errorCode,errorMessage};
      });
    // [END auth_signin_password]
  }

  async function signUpWithEmailPassword(email,password,res,record){
    // [START auth_signup_password]
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        res.json({user,record});
      })
      .catch((error) => {
          console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        res.json(error);
        return{error,errorCode,errorMessage}
      });
    // [END auth_signup_password]
  }
  

module.exports = authRouter;

