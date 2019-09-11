const express = require('express')
const app = express();

app.get('/', (req, res) => {
    res.send('First Parking App!')
});

app.listen(8000, () => {
    console.log('First Parking listening on port 8000!')
});