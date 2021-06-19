const express = require('express');
const multer = require('multer');

const Product = require('./models');
const productMiddleware = require('../../middleware/product');
const uploadMiddleware = require('../../middleware/uploadImage');

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/getAllProduct', (req, res) => {
    Product.Category.find((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

router.get('/getProduct', (req, res) => {
    const filter = req.query;
    Product.Category.find(filter, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                data: data
            });
        }
    });
});


/* 
{
    "userId": "609ab05eabddac700c9e5420",
    "collab": "609ab05eabddac700c9e5420",
    "productName": "The Abstract Ocean Bubble 100% Hand Painted Wall Painting (With Outer Floater frame)",
    "category": "Art",
    "subCategory": "Prints",
    "productType": "Photography",
    "stock": 1,
    "price": 7999.00,
    "discPrice": 7100,
    "quantity": 1,
    "size": {
        "height": "36 Inches",
        "weidth": "48 Inches",
        "depth": "5 Inches"
    },
    "color": "Deep Blue",
    "rarity": "Limited Edition",
    "waysToBuy": "Buy Now",
    "buyFrom": "Artists"
}
*/
router.post('/addProduct', (req, res) => {
    let model = new Product.Category(req.body);
    model.save((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            let details = {
                productId: data._id,
                productDescription: "Painting",
                packageType: "Carton",
                location: "Thimpu",
                originCountry: "Bhutan",
                shipingCountry: "India",
            }
            let model = new Product.Details(details);
            model.save((err, data) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.json({
                        success: true,
                        message: 'Product Details Add into database'
                    });
                }
            });
        }
    });
});

router.put('/updateProduct/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Product.Category.findOneAndUpdate({ _id: id }, body, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

router.delete('/deleteProduct/:id', productMiddleware.deleteProductDetails, productMiddleware.deleteProductReview, (req, res) => {
    const id = req.params.id;
    Product.Category.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});


// Product Details
router.get('/productDetails/:id', (req, res) => {
    const productId = req.params.id;
    Product.Details.find({ productId: productId }, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                data: data
            });
        }
    });
});

/*
{
    productId: 609946fdba377359532041ca,
    productDescription: "String"
}
*/
router.post('/addProductDetails', (req, res) => {
    let model = new Product.Details(req.body);
    model.save((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                message: 'Product Details Add into database'
            });
        }
    });
});

router.put('/updateProductDetails/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Product.Details.findOneAndUpdate({ _id: id }, body, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

router.post('/addProductImage', upload.single("product"), uploadMiddleware.uploadProductImage);

router.post('/uploadProductImage', (req, res) => {
    let model = new Product.Image(req.body);
    model.save((err, profile) => {
        if (err) {
            res.send(err);
        } else {
            res.json('Product Images uploaded successfully into Database');
        }
    });
});


router.get('/getVariant', (req, res) => {
    Product.Variant.findOne((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }
    });
});

/* {
    "colors": [{
        "color": "Blue",
        "code": "#0000FF"
    }, {
        "color": "Red",
        "code": "#FF0000"
    }],
    "size": ["Height", "Weidth", "Depth"],
    "shape": ["Triangle", "Rectangular", "Circle"],
    "pattern": ["Printed", "Canvas", "Oil Painting"],   // Finishing Type, Painting Type
    "type": ["Handmade", "Images"],
    "material": ["Acrylic", "Wood And Canvas"],
    "frame": ["Without Frame", "Wooden", "As per requirement"],
    "style": ["Modern", "Hanging", "Tabletop", "Floor"],
    "packingType": ["Box"]
}
*/
router.post('/addVariant', (req, res) => {
    const obj = req.body;
    obj.fieldName = "ProductVarient";
    obj.updatedDate = new Date();

    Product.Variant.findOneAndUpdate({ fieldName: "ProductVarient" }, obj, {
        new: true,
        upsert: true // Make this update into an upsert
    }, (err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json(data);
        }

    });
});

// router.put('/updateVariant/:id', (req, res) => {
//     const id = req.params.id;
//     const body = req.body;
//     Product.Variant.findOneAndUpdate({ _id: id }, body, (err, data) => {
//         if (err) {
//             res.send(err.message);
//         } else {
//             res.json(data);
//         }
//     });
// });

module.exports = router;