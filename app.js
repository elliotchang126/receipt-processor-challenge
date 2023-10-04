const express = require('express');
const { v4: uuid } = require('uuid');

// Using Express to set up backend server
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// store receipts in memory
const receipts = {};

// calculate points based on receipt
const calculatePoints = (receipt) => {
    let points = 0;

    const total = parseFloat(receipt.total); // convert to float
    
    // Rule 1: 1 point for alphanumeric characters in retailer name
    const alphaNumChars = receipt.retailer.match(/[a-zA-Z0-9]/g); // match alphanumeric characters
    points += alphaNumChars.length; // 1 pt for every alphanumeric character

    // Rule 2: 50 points for round totals
    if (total % 1 === 0) points += 50; // if total ihas no remainder add 50 points

    // Rule 3: 25 points for being a multiple of 0.25
    if (total % 0.25 === 0) points += 25; // if total has no remainder add 25 points

    // Rule 4: 5 points for every 2 items
    const totalItems = receipt.items.length; // get total number of items

    points += Math.floor(totalItems / 2) * 5; // calculate points

    // Rule 5: 0.2 multiplier for trimmed descriptions lengths that are multiples of 3
    for (let item of receipt.items) { // iterate through items
        const price = parseFloat(item.price); // convert to float
        const trimmedDesc = item.shortDescription.trim(); // trim whitespace from ends of string

        if (trimmedDesc.length % 3 === 0) { // if length is a multiple of 3
            points += Math.ceil(price * 0.2); // add 0.2 multiplier, round to highest integer
        }
    }

    // Rule 6: 6 points for odd days
    const day = parseInt(receipt.purchaseDate.split('-').pop()); // split string, grab last element, convert to int
    if (day % 2 !== 0) points += 6; // if not divisible by 2, it's odd. Add 6 pts

    // Rule 7: 10 points for purchases between 2pm and 4pm
    const timeArr = receipt.purchaseTime.split(':'); // split string into array
    const hour = parseInt(timeArr[0]); // grab first element, convert to int

    // 2pm - 4pm, but we would need more direction on if it's inclusive or exclusive
    if (hour >= 14 && hour < 16) points += 10;

    return points; // return total points
}

app.post(`/receipts/process`, (req, res) => { // POST request to /receipts/process
    const id = uuid(); // generate unique id
    receipts[id] = req.body; // set id as key, receipt body as value
    res.json({ id }); // return id
});

app.get(`/receipts/:id/points`, (req, res) => { // GET request to /receipts/:id/points
    const id = req.params.id; // grab id from params
    const receipt = receipts[id]; // grab receipt from receipts object

    if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found' }); // if receipt doesn't exist, return 404
    }
    const points = calculatePoints(receipt); // calculate points

    res.json({ points }); // return points
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); // log port
});