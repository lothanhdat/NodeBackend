'use strict'
const {product, clothing, electronics, furniture} = require('../models/product.model');
const {BadRequestError} = require('../core/error.response');
const {findAllDraftsForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllPublishedForShop} = require('../models/repositories/product.repo')


// define Factory class to create product
class ProductFactory{
    /**
     * type:'Clothing',
     * payload
     */

    static productRegistry = {} // key-class - strategy pattern
    static registerProductType (type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
    }
    // GET //
    static async searchProductByUser({keySearch}) {
        console.log('req.params.keySearch', keySearch)
        return await searchProductByUser({keySearch})
    }
    // END GET //
    // PUT //
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    // END PUT //
    // query
    static async findAllDraftsForShop ({product_shop, limmit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limmit, skip})
    }

    static async findAllPublishedForShop ({product_shop, limmit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishedForShop({query, limmit, skip})
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

//define sub-class for diffrence product types Furniture
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop:this.product_shop})
        if (!newFurniture) throw new BadRequestError('Failed to create new furniture product')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Failed to create new Product product')

        return newProduct
    }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory