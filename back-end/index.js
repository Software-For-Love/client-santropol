
const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const firebase = require('firebase/app');
const data = require('./santropolroulant-b4d14-export.json');
const app = express();
const port = 5000;
const indexRouter = require('./routes/routes');
const firebaseConfig = require("../.env.development.local/firebaseconfig.json")
const cors = require('cors');


initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*'}));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});