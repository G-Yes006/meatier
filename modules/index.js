const express = require('express');
const app = express();

const admin = require('./admin/controller');
const user = require('./user/controller');

const product = require('./product/controller');
const review = require('./review/controller');
const wishlist = require('./wishlist/controller');

app.use('/admin', admin);
app.use('/user', user);
app.use('/product', product);
app.use('/review', review);
app.use('/wishlist', wishlist);



module.exports = app;