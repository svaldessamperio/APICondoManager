const express = require('express');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/inetpub/wwwroot/images/')
  },
  filename: (req, file, cb) => {
    let filename = file.originalname.split('.')[0] + Date.now() + '.' + file.originalname.split('.')[1];
    //cb(null, `${file.originalname}-${+Date.now()}`)
    cb(null, `${filename}`)
  }
})

const router = express.Router();
const mysqlConnection = require('../database');
const upload = multer({ storage });

router.post("/upload", upload.array("files"), (req, res) => {
  //const {condominiumId, unitId, ticketId} = req.body;
  //console.log(condominiumId, unitId, ticketId);
  console.log(req.files);
  res.json(req.files);
});

module.exports = router;