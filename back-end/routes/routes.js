const express = require('express');
const data = require('../santropolroulant-b4d14-export.json')
const router = express.Router();
const firestore = require("firebase/firestore");
const { getFirestore, getDoc } = require('firebase/firestore');
const {doc,setDoc, collection, getDocs} = require('firebase/firestore');
const { getCollection } = require('../database/getData');
// const {getCollection} = require('../database/getData')

router.get('/', (req, res, next) => {
    res.json({result: 'OK'});
  });

router.get('/migrateDB',async (req,res)=>{
    try{
        const db = getFirestore();
        const result = data.bug[1];
        Object.keys(data).forEach( root => {
           
            Object.keys(data[root]).forEach(async (element) =>{
                    console.log(root);
                    console.log(element);
                    console.log(data[root][element]);
                    const obj = data[root][element];
                    //DO NOT USE THIS CODE
                    // await setDoc(doc(db,root,element),obj);
                    // db.collection(root).doc(element).(map);
                });
        
            });
        
    }
    catch(e){
        console.error("Error adding document: ", e);
    }
    res.json({bug: data.bug[1]})

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

})

router.get('/Test', async (req, res) => {
    const db = getFirestore();
    getCollection(db, "test", null).then(data =>  console.log(datasnapshot.data())).catch(e => console.log("error ",e) );
})

module.exports = router;