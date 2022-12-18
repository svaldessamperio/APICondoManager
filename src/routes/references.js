const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

router.post('/create/', (req,res)=> {
    const { condominiumId, unitId, periodoId, numberOfDocuments, totalmount, details} = req.body;

    const insertReference = (condominiumId, unitId, periodoId, numberOfDocuments, totalmount) => {
        return new Promise((resolve, reject) => {
            const qry = `
            SET @referenceCode = '';
            CALL createReference (?, ?, ?, ?, ?, @referenceCode);
            SELECT @referenceCode;
            `;
            mysqlConnection.query(qry, 
                [ condominiumId, unitId, periodoId, numberOfDocuments, totalmount ], ( err, rows, fields )=>{
                    if(!err) {
                        referenceId = JSON.parse(JSON.stringify(rows[2][0]).replace("@","")).referenceCode;
                        resolve(referenceId);
                    } else {
                        reject(err);
                    }
            });
        });
    }

    const insertDetail = (referenceId, documentId) => {
        return new Promise((resolve, reject) => {
            const qry = `
            SET @response = '';
            CALL createReferenceDetail (?, ?, @response);
            SELECT @response;
            `;
            mysqlConnection.query(qry,[ referenceId, documentId ], (err, rows, fields)=>{
                if (!err) {
                    //revisa si hay respuesta de error manejado en el SP (SQL EXCEPTION)
                    // o error de negocio
                    if(rows[2][0] != undefined) {
                        const errores = "" + JSON.parse(JSON.stringify(rows[2][0]).replace("@","")).response;
                        if (errores.substring(0,3) === 'ERR'){
                            const respuesta = JSON.parse(JSON.stringify(rows[2][0]).replace("@",""));
                            reject(respuesta);
                        }
                    }
                    if (rows[1].length > 0) {
                        const respuesta = JSON.parse(JSON.stringify(rows[1][0]).replace("@","").replace("@",""));
                        reject(respuesta);
                    } else {
                        resolve("SUCCESS");
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    const insertDetails = async (referenceId, details)=>{
        let documentId;
        let errors = [];
        for (i=0;i<details.length;i++) {
            documentId = details[i].documentId;
            try {
                const respu = await insertDetail(referenceId, documentId);
            } catch (err) {
                errors.push(err);
            }
        }
        return new Promise((resolve, reject) => {
            if(errors.length > 0){
                reject(errors);
            } else {
                resolve("SUCCESS")
            }
        });
    }
    mysqlConnection.beginTransaction(async (err)=>{
        try {
            const referenceId = await insertReference(condominiumId, unitId, periodoId, numberOfDocuments, totalmount);
            const insDetails = await insertDetails(referenceId, details);
            console.log(insDetails);
            res.send("200");
            mysqlConnection.commit((err)=>{
                if (err) {
                  return connection.rollback(()=>{
                    throw err;
                  });
                }
            });             
        } catch(err){
            res.json(err);
            return mysqlConnection.rollback((erro)=>{
                 console.log(erro);
            });
        }
    });
});


router.post('/createDetail/', (req,res) => {
    const { referenceId , documentId} = req.body;
    const qry = `
        SET @response = '';
        CALL createReferenceDetail
        SELECT @response;
    `;
    mysqlConnection.query(qry,[ referenceId, documentId ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;