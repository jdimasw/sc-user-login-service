const express = require('express')
const app = express()
const port = 3001
const mongoose = require('mongoose');
const controller = require('./controller');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', (req, res) => {
  res.send({data: 'pinged'});
})

app.use('/auth', controller);

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!')
);

app.listen(port, () => {
  console.log(`User Login Service listening at http://localhost:${port}`)
})
