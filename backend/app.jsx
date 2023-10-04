const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const receipts = {};

const calculatePoints = (receipt) => {
    let points = 0;

    const total = parseFloat(receipt.total);
    
    const alphaNumChars = receipt.retailer.match(/[a-zA-Z0-9]/g);
    points += alphaNumChars.length;

    if (total % 1 === 0) points += 50;

    if (total % 0.25 === 0) points += 25;

    const totalItems = receipt.items.length;

    points += Math.floor(totalItems / 2) * 5;
}

app.post(`/receipts`, (req, res) => {
    const id = uuid();
});

app.get(`/receipts/:id`, (req, res) => {
};
