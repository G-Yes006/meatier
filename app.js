require('dotenv').config()
const mongoose = require("mongoose");

const currency = require('./middleware/currency');

// 'mongodb://localhost/artcurate'
mongoose.connect('mongodb+srv://admin:artcurate123@cluster0.htbgj.mongodb.net/artcurate?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Database has Connected");
}).catch(err => {
    console.log("Error : " + err);
});

currency();
setInterval(() => {
    console.log(new Date());
    currency();
}, 86400000);