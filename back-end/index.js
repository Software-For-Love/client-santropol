
require('dotenv').config()
const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const firebase = require('firebase/app');
const app = express();
const port = process.env.PORT || 5000;
const indexRouter = require('./routes/routes');
const authRouter = require('./routes/authRouter')
const eventRouter = require('./routes/eventRoutes')

const cors = require('cors');
const firebaseConfig = {
    apiKey: process.env.NODE_APP_API_KEY,
    authDomain: process.env.NODE_APP_AUTH_DOMAIN,
    projectId: process.env.NODE_APP_PROJECT_ID,
    storageBucket: process.env.NODE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.NODE_APP_MESSAGING_SENDER_ID,
    appId: process.env.NODE_APP_APP_ID,
    measurementId: process.env.NODE_APP_MEAUSERMENT_ID,
};


initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*'}));

app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/events',eventRouter);


app.listen( port, () => {
    console.log(`Now listening on port ${port}`);
});