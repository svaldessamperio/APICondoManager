
const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('./', (req,res) => {
    const { code, amount } = req.body;
    const qry = `
        SET @response = 0;
        CALL setPayFromReference (?,?, @response);
        SELECT @response;
    `;
    mysqlConnection.query(qry,[code, amount],(err,rows,fields) => {
        if(!err){
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;

