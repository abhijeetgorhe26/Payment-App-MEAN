// import lib using npm
import express from 'express';
import 'dotenv/config'

// define app
const app = express();
const port = process.env.PORT;



// testing route
app.get('/', (req, res) => {
    res.send("Hello world..!")
});


// hosting on http://localhost:3000/
app.listen(port, () => {
    console.log(`Hey buddy, my server is running on http://localhost:${port}`);
});