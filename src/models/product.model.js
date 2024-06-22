'use string'
const {model, Schema} = require('mongoose'); // erase if already require
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const slugify = require('slugify');

const productSchema = new Schema({
    product_name: {type: String,required: true},
    product_thumb: {type: String,required: true},
    product_description: String,
    product_slug: String,
    product_price: {type: Number,required: true},
    product_quantity: {type: Number,required: true},
    product_type: {type: String,required: true, enum:['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true},
    product_rating: { type: Number, default: 4.5, min: [1,'Rating must be abobe 1'],
        max: [5,'Rating must be below 5'], set:(val) => Math.round(val * 10) / 10},
    product_variations: {type: Array, default: []},
    isDraft: {type:Boolean, default:true, index:true, select: false},
    isPublished: {type:Boolean, default:false, index:true, select: false}
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);

//create index for search
productSchema.index({product_name: 'text', product_description: 'text'})
//Document middleware: runs before .save() and .create()
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
})

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