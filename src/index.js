const express = require('express');
const app=express();

//Settings
app.set('port', process.env.port || 3000);

//Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/unit', require('./routes/units'));
app.use('/api/balance', require('./routes/balance'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/references', require('./routes/references'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/advertisements', require('./routes/advertisements'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/files', require('./routes/files'));

//Starting Server
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
})