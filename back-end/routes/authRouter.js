const express = require('express');
const authRouter = express.Router();
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIR_TABLE_API
});
    
var airTableBase = Airtable.base('appB7a5gvGu8ELiEp');


authRouter.post('/register', async(req,res)=>{
    const username = req.query.username;
    const password = req.query.password;
    console.log(`User register [username]: ${username} [password]: ${password}`);

    airTableBase('👥 Volunteers').select(
        {fields:['Courriel'],
        filterByFormula:`({Courriel}=\"${username}\")`}
        ).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function(record) {
                res.json({result: 'User already exists'});
            });
        
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        }, function done(err) {
            if (err) { console.error(err); return; }
            res.json({result:'User not found'});
        });
});

module.exports = authRouter;

