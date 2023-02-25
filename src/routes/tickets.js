const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

function getTicketsAndImages(ticketDB, imagesDB){
  
  let payload = {...ticketDB};
  let { condominiumId, unitId, ticketId } = payload;
  let imagesByTicket = new Array();
  
  for (let i=0;i<imagesDB.length;i++){
    if (imagesDB[i].condominiumId === condominiumId && 
        imagesDB[i].unitId === unitId &&
        imagesDB[i].ticketId === ticketId)
    {
        let image = {
            id: imagesDB[i].ImageId,
            url: imagesDB[i].url
        }
        imagesByTicket.push(image);
    }
  }
  payload = {...payload, images: imagesByTicket};
  return payload;
}

router.get('/getTicketsByUnit', (req, res)=>{
    const { condominiumId, unitId, idUser } = req.query;
    const qry = `
        CALL getTicketsByUnit (?, ?, ?);
    `;
    mysqlConnection.query(qry,[condominiumId, unitId, idUser], (err, rows, fields)=>{
        let tickets2Ui = new Array();
        if (!err) {
            let todos = new Array(rows);
            const ticketsDB = todos[0][0];
            const imagesDB = todos[0][1];
            for(let i=0;i<ticketsDB.length;i++){
                tickets2Ui.push(getTicketsAndImages(ticketsDB[i], imagesDB));
            }
        } else {
            console.log(err);
        }
        res.json(tickets2Ui);
    });

});

router.post('/createTicket', (req, res)=>{
    const { forms  } = req.body;
    let ticketCreatedId = 0;

    const qry = `
        SET @ticketCreated = 0;
        CALL createTicket (?, ?, ?, ?, ?, @ticketCreated);
        SELECT @ticketCreated;
    `;
    mysqlConnection.query(qry,[ forms.condominiumId, forms.unitId, forms.idUser, forms.placeId, forms.description ], (err, rows, fields)=>{
        let payload = {};
        if (!err) {
            ticketCreatedId = JSON.parse(JSON.stringify(rows[2][0]).replace("@","")).ticketCreated;
            payload = {ticketCreatedId}
            
            // Insert images
            const filesLoaded = new Array(forms.filesLoaded != undefined ? (forms.filesLoaded != null?forms.filesLoaded : []) : []);
            const qryImages = `CALL createTicketImages (?,?,?,?)`;
            for(i = 0; i < filesLoaded[0].length; i++){
                //console.log(JSON.stringify(filesLoaded[0][i]));
                url = 'http://192.168.1.78/images/' + filesLoaded[0][i].filename;
                mysqlConnection.query(qryImages,[ forms.condominiumId, forms.unitId, ticketCreatedId, url ], (err, rows, fields)=>{
                if (!err) {
                    console.log(rows);
                } else {
                    console.log(err);
                }
                });
            }
            res.json(payload);

        } else {
            console.log(err);
        }
    });
});

router.post('/createComment', (req,res) => {

    const { condominiumId, unitId, ticketId, userId, comment} = req.body;

    const qry = `
        CALL createComment (?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(qry,[ condominiumId, unitId, ticketId, userId, comment ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/getTicketComments',(req, res) => {
    const { condominiumId, unitId, ticketId } = req.query;

    const qry = `
    CALL getTicketComments (?, ?, ?);
    `;
    mysqlConnection.query(qry,[ condominiumId, unitId, ticketId ], (err, rows, fields)=>{
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;