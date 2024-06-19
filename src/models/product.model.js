'use string'
const {model, Schema} = require('mongoose'); // erase if already require
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum:['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
    }},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

//define the product type = clothing
const clothingSchema = new Schema({
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    brand:{type:String},
    size: String,
    material: String,
},{
    collection: 'clothes',
    timestamps: true
})

//define the product type = electronics
const electronicsSchema = new Schema({
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    manufacturer:{type:String, required:true},
    model: String,
    color: String,
},{
    collection: 'electronics',
    timestamps: true
})

//define the product type = furniture
const furnitureSchema = new Schema({
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    brand:{type:String, required:true},
    size: String,
    material: String,
},{
    collection: 'furniture',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema),
    furniture: model('Furniture', furnitureSchema)
}