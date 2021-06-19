const express = require('express');

const Review = require('./models');

const router = express.Router();

router.get('/allReview/:productId', (req, res) => {
    const productId = req.params.productId;
    Review.Comment.find({productId: productId}, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

/* 
{
    "productId": "609976e781f2da5ce0a67dd2",
    "userId": "609976e781f2da5ce0a67dd2",
    "productType": "Photography",
    "rating": 5,
    "reviewHeading": "Awesome Product",
    "review": "This just made our living room fantastic. Goes well with the Hand-Painted Wall Painting.",
    "reviewImage": ["The Abstract Ocean Bubble 1.jpg", "The Abstract Ocean Bubble 2.jpg"],
    "reviewerName": "Swarup Saha",
    "reviewerEmail": "swarup.saha004@hotmail.com"
};
*/
router.post('/addReview', (req, res) => {
    let model = new Review.Comment(req.body);
    model.save((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                message: 'Review inserted for product'
            });
        }
    });
});


router.get('/getFeedback/:productId', (req, res) => {
    const productId = req.params.productId;
    Review.Feedback.find({productId: productId}, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});
router.post('/addFeedback', (req, res) => {
    let model = new Review.Feedback(req.body);
    model.save((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                message: 'Review inserted for product'
            });
        }
    });
});

module.exports = router;