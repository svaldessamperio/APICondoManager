const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

router.get('/',(req, res) => {
    
    const { condominiumId, unitId} = req.query;
    var salida;

    const qry = `
        SET @salida=0.0;
        CALL getUnitBalance(?, ?, @salida);
        SELECT @salida;
    `;
    // mysqlConnection.query( "SET @salida = 0; CALL getUnitBalance(1, 98, @salida); SELECT @salida", (err, rows) => {
    //     if (err) throw err;
    //     console.log('Data received from Db:n');
    //     console.log(rows); 
    // });
    
    mysqlConnection.query(qry, [condominiumId, unitId], (err, rows, fields) => {
        if (!err) {
            let payload = [{}];
            const { salida } = JSON.parse(JSON.stringify(rows[3][0]).replace("@",""));
            const movements = JSON.parse(JSON.stringify(rows[1]).replace("RowDataPacket", ""));
            payload = [
                { 
                    saldo: salida 
                },
            ];

            for(var i=0;i<movements.length;i++){
                payload.push(movements[i]);
            }
            res.json(payload);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;
