
const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const CryptoJS = require("crypto-js");

router.post('/createQR4Access', (req,res) => {

    const { condominiumId, unitId, idUser, placeId, visitName, make, model, color, license, initDate, numberDays, comment, people } = req.body;

    const qry = `
        SET @qrAccessId = 0;
        SET @result = '';
        CALL createQR4Access (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @qrAccessId, @result);
        SELECT @result, @qrAccessId;
    `;

    mysqlConnection.query(qry,[ condominiumId, unitId, idUser, placeId, visitName, make, model, color, license, initDate, numberDays, comment, people ], (err, rows, fields)=>{
        if (!err) {
            qrAccesId = JSON.parse(JSON.stringify(rows[3][0]).replaceAll("@","")).qrAccessId;
            // Encrypt
            var ciphertext = CryptoJS.AES.encrypt(qrAccesId.toString(), 'Condo Manager 2022').toString();
            // Decrypt
            //var bytes  = CryptoJS.AES.decrypt(ciphertext, 'Condo Manager 2022');
            //var originalText = bytes.toString(CryptoJS.enc.Utf8);

            res.json({data:ciphertext});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;