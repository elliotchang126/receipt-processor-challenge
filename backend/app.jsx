const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const receipts = {};

const calculatePoints = (receipt) => {

}

app.post(`/receipts`, (req, res) => {
    const id = uuid();
});

app.get(`/receipts/:id`, (req, res) => {
};
