const { async } = require('@firebase/util');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');


//Need to figure out how to check if in local environment, or deployed on server
tempEnvCheck = false;
// if(tempEnvCheck){
//     initializeApp({
//         credential: applicationDefault()
//     })

// } else {
//     const serviceAccount = require('../../.env.development.local/santro-migrate-firebase-admin-key.json');
//     initializeApp({
//         credential: cert(serviceAccount)
//       });      
// }


//IS THERE A BETTER WAY TO PASS DB INSTANCE TO ALL THESE FUNCTIONS? Use models?
//TODO: Can maybe make where clause more dynamic later using for loop and calling "where" repeatedly, since it returns queryable collection
async function getCollection(db, collectionName, whereClause){
    if(whereClause){
        const collecitonRef =   db.collection(collectionName).where(whereClause[attribute], whereClause[comparator], whereClause[value]);
    } else {
        const collecitonRef =   db.collection(collectionName);
    }
    const collection = await collecitonRef.get();

    return collection;

}

// Remember, this will look at ALL collections at any level anywhere
async function getSubcollection(db,collectionGroup, whereClause){
    if(whereClause){
        const collecitonRef =   db.collectionGroup(collectionName).where(whereClause[attribute], whereClause[comparator], whereClause[value]);
    } else {
        const collecitonRef =   db.collectionGroup(collectionName);
    }
    const collection = await collecitonRef.get();

    return collection;

} 

async function getDocument(db,collectionName, docName){

}


exports.getCollection = getCollection
    
