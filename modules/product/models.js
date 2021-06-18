const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

// Product
const productCategory = {
    _id: { type: objectId, auto: true },
    userId: { type: objectId, required: true },
    collab: [{ type: objectId, required: true }],
    productName: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    productType: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    discPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: Schema.Types.Mixed,
    color: { type: String, required: true },
    rarity: { type: String, required: true },
    waysToBuy: { type: String, required: true },
    buyFrom: { type: String, required: true },
    status: { type: Boolean, default: 1 },
    createdDate: { type: Date },
    updatedDate: { type: Date }
};
const productCategorySchema = new Schema(productCategory, { versionKey: false });

productCategorySchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        console.log(currentDate);
        this.createdDate = currentDate;
    }
    next();
});

productCategorySchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre productCategorySchema Update");
    this.updatedDate = new Date();
    next();
});


// Product Image
const productImage = {
    _id: { type: objectId, auto: true },
    productId: { type: objectId, required: true },
    productImage: Schema.Types.Mixed,
    productVideo: Schema.Types.Mixed,
    createdDate: Date,
    updatedDate: Date
};

const productImageSchema = new Schema(productImage, { versionKey: false });

productImageSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
});
productImageSchema.pre('findOneAndUpdate', function (next) {
    this.updatedDate = new Date();
    next();
});


// Product Details
const productDetails = {
    _id: { type: objectId, auto: true },
    productId: { type: objectId, required: true },
    productDescription: { type: String, required: true },
    packageType: { type: String, required: true },
    location: { type: String, required: true },
    originCountry: { type: String, required: true },
    shipingCountry: { type: String, required: true },
    createdDate: Date,
    updatedDate: Date
};
const productDetailsSchema = new Schema(productDetails, { versionKey: false });

productDetailsSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;
    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
});
productDetailsSchema.pre('findOneAndUpdate', function (next) {
    console.log("Pre productDetailsSchema Update");
    this.updatedDate = new Date();
    next();
});


// Product Varients
const productVariant = {
    _id: { type: objectId, auto: true },
    fieldName: { type: String, required: true },
    colors: Schema.Types.Mixed,
    size: Schema.Types.Mixed,
    shape: Schema.Types.Mixed,
    pattern: Schema.Types.Mixed,    // Finishing Type, Painting Type
    type: Schema.Types.Mixed,
    material: Schema.Types.Mixed,
    frame: Schema.Types.Mixed,
    style: Schema.Types.Mixed,
    packingType: Schema.Types.Mixed,
    updatedDate: Date,
};
const productVariantSchema = new Schema(productVariant, { versionKey: false });

module.exports = {
    Category: mongoose.model("product", productCategorySchema),
    Image: mongoose.model("productImage", productImageSchema),
    Details: mongoose.model("productDetails", productDetailsSchema),
    Variant: mongoose.model("productVariant", productVariantSchema)
};