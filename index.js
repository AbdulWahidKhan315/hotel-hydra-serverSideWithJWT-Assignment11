const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());






app.get('/', (req, res) => {
    res.send('Hotel Hydra server is running....')
})

app.listen(port, () => {
    console.log(`Hotel Hydra server is runnig on port: ${port}`);
})

//hotelHydra
//bslblUgE3P6Pl8HF