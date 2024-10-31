require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/user', require('./routes/userRoutes'));

app.listen(port, () => {
    console.log(`Server running at Port ${port}`);
});
