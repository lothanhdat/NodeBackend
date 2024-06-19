'use strict'
const {product, clothing, electronics} = require('../models/product.model');
const {BadRequestError} = require('../core/error.response');


// define Factory class to create product
class ProductFactory{
    /**
     * type:'Clothing',
     * payload
     */
    static async createProduct(type, payload){
        console.log('type:-->',type);
        console.log('payload:-->',payload)
        switch(type){
            case 'Electronics':
                return new Electronics(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type ${type}`)
        }

    }
}

//define base product class
class Product {
    constructor({product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes}){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new prduct
    async createProduct(product_id){
        return await product.create({...this,_id:product_id})
    }
}


// define sub-class for diffrence product types Clothing
class Clothing extends Product{
    async createProduct(){
        console.log('creating product: ',this.product_attributes);
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop:this.product_shop})
        if (!newClothing) throw new BadRequestError('Failed to create new clothing product')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Failed to create new Product product')

        return newProduct
    }
}

// define sub-class for diffrence product types Electronics
class Electronics extends Product{
    async createProduct(){
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop:this.product_shop})
        if (!newElectronics) throw new BadRequestError('Failed to create new electronics product')

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError('Failed to create new Product product')

        return newProduct
    }
}

module.exports = ProductFactory