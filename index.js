// import lib using npm
import express from 'express';
import 'dotenv/config'

// import the things from other location.... ex. controllers, routes
import userRoute from './routes/userRoute.js'


// define app
const app = express();
const port = process.env.PORT || 3000;

//

// middlewares
app.use(express.json());


// middleware routes
app.use('/auth', userRoute);


// testing route
app.get('/', (req, res) => {
    res.send("Hello world..!")
});


// hosting on http://localhost:3000/
app.listen(port, () => {
    console.log(`Hey buddy, my server is running on http://localhost:${port}`);
});