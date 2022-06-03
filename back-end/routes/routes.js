require('dotenv').config()
const express = require('express');
const router = express.Router();
const firestore = require("firebase/firestore");
const { getFirestore, getDoc } = require('firebase/firestore');
const {doc,setDoc, collection, getDocs} = require('firebase/firestore');
const { getCollection } = require('../database/getData');
const base = require('../index')
// const {getCollection} = require('../database/getData')



router.get('/', (req, res, next) => {
    res.json({result: 'OK'});
  });

  

router.get('/getUsers', async (req,res)=>{
    try{
        const db = getFirestore();
        var users = [];
        await getDocs(collection(db, "user")).then(querySnapshot =>{
            let docs = querySnapshot.docs;
            for(let doc of docs){
                users.push(doc.data())
            }
            res.json(users);
        } );


    }
    catch(e){
        console.error("Error getting users ", e);
        res.json(e);
    }

});

router.get('/getUserById', async (req,res)=>{
    const uid = req.query.uid;
    const db = getFirestore();
    const ref = doc(db,"user",uid);
    const docSnap = await getDoc(ref);
    if(docSnap.exists()){
        res.json(docSnap.data());
    }
    res.json({error: "User with ID: "+ uid+ " not found."})

});

router.get('/Test', async (req, res) => {
    const db = getFirestore();
    getCollection(db, "test", null).then(data =>  console.log(datasnapshot.data())).catch(e => console.log("error ",e) );
});

router.get('/airTableVolunteers', async(req,res) =>{
    var Airtable = require('airtable');
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.AIR_TABLE_API
    });
    var base = Airtable.base('appB7a5gvGu8ELiEp');
    
    base('👥 Volunteers').select({
        // Selecting the first 3 records in Active vols - 🔍 search here:
        maxRecords: 3,
        view: "Active vols - 🔍 search here"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            console.log('Retrieved', record.get('full name (auto)'));
        });
        res.json(records);
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }
    });

})

module.exports = router;