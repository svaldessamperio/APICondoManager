const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//obtain the advertaisements for a unique condominium 
router.get('/',(req, res) => {
    const { condominiumId } = req.query;
    const qry = `
    SET @salida=0.0;
    CALL getAdvertisements(?);`;
    console.log("advertaisements, advertaisements, advertaisements");

    mysqlConnection.query(qry, [condominiumId], (err, rows, fields) => {
        if (!err) {
            let payload = [{}];
            const data = JSON.parse(JSON.stringify(rows[1]).replace("RowDataPacket", ""));

            res.json(data);
        } else {
            console.log(err);
        }
    });

});

module.exports = router;