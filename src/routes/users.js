const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database')

router.post('/addUserToken/',async (req, res) => {
    const { user, tokenStr } = req.body;
    
    const insertaToken = (user, tokenStr) => {
        return new Promise ((resolve, reject) => {
            const qry = `
            SET @response = '';
            CALL insertUserToken (?, ?, @response);
            SELECT @response;
            `;
            mysqlConnection.query(qry, 
                [ user, tokenStr ], ( err, rows, fields )=>{
                    if(!err) {
                        referenceId = JSON.parse(JSON.stringify(rows[2][0]).replace("@",""));
                        resolve(referenceId);
                    } else {
                        reject(err);
                    }
            });
        });
    }
    try {
        await insertaToken (user, tokenStr).then((err)=>{
            console.log("SALIDA: ", err);
            if (err) {
                res.json(err);
            }
        });
    } catch (err){
        res.json(err);
    }
});

router.get('/getUserDataByEmail/', (req, res) => {
    const { email } = req.query;
    const qry = `CALL getUserDataByEmail(?);`;

    //if(!email=='undefined'){
        mysqlConnection.query(qry, [email], (err, rows, fields) => {
            if (!err) {
                let payload = {};
                if(rows[0].length>0){
                    const userData = JSON.parse(JSON.stringify(rows[0][0]));
                    payload = { userData };
                }
                console.log(payload);
                res.json(payload);
            } else {
                console.log(err);
            }
        });    
    //}
});

router.get('/getConfigSystem', (req, res)=>{
    const { condominiumId } = req.query;
    const qry = `CALL getConfigSystem(?);`;
    mysqlConnection.query(qry, [condominiumId], (err, rows, fields) => {
    if (!err) {
        if(rows[0].length>0){
            let ticketImages = {};
            let ticketAdvertisements = {};
            let generalParameters = {};
            let payload = {};
            for(let i=0;i<rows[0].length;i++) {
                parameter = {...rows[0][i]};
                let field = parameter.name;
                switch (parameter.type) {
                    case 'T': //Ticket Images
                        ticketImages = {...ticketImages, [field]:parameter};
                        break;
                    case 'A': //Advertisement Images
                        ticketAdvertisements = {...ticketAdvertisements, [field]:parameter};
                        break;
                    default:  //other ones
                        generalParameters = {...generalParameters, [field]:parameter};
                        break;
                }
            }
            payload = {
                ticketImages,
                ticketAdvertisements,
                generalParameters
            }
            res.json(payload);
        }
    } else {
        console.log(err);
    }
    }); 
});

module.exports = router;