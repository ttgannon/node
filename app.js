global.items = [];
const express = require('express');
const app = express();
const userRoutes = require("./userRoutes");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/items', userRoutes ); 


app.use((err, req, res, next) => {
    let msg = err.message;
    let status = err.status;
    return res.status(status || 500).json({error: msg});
})



module.exports = {items, app, global};