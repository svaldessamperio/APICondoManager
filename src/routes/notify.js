const express = require('express');
const mysqlConnection = require('../database');
const router = express.Router();

async function getTokensByUser(email) {
    const tokens = [];
    return new Promise((resolve, reject) => {
        const qry = `
        SET @salida=0.0;
        CALL getUnitBalance(?, ?, @salida);
        SELECT @salida;
        `;
        mysqlConnection.query(qry, [condominiumId, unitId], (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
    });
    return tokens;
}

router.post('/sendMessageByEmail', (req, res) => {
    const { email, notification } = req.body;
    const tokens = [];

});

module.exports = router;