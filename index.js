const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./Routers/routers');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

mongoose.connect(process.env.DATABASE_URL)
.then(()=> {
    console.log("mongodb is connected...")
    app.listen(4000,()=> {
        console.log("server is started on localhost:4000...")
    })
}).catch((err) => {
    console.log(err);
});
