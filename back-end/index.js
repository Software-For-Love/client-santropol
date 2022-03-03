
const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const firebase = require('firebase/app');
const data = require('./santropolroulant-b4d14-export.json');
const app = express();
const port = 5000;
const indexRouter = require('./routes/routes');
const cors = require('cors');

const firebaseConfig = {

    apiKey: "AIzaSyDksI61QxwJvLmqsXVixe4A7VReiG19bas",
  
    authDomain: "santro-migrate.firebaseapp.com",
  
    projectId: "santro-migrate",
  
    storageBucket: "santro-migrate.appspot.com",
  
    messagingSenderId: "572407964102",
  
    appId: "1:572407964102:web:7d56b7c1ecad6a2c41d2c7",
  
    measurementId: "G-1204JD4Q4W"
  
  };

initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*'}));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});