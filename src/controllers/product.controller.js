"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service_v2");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully !",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop:req.user.userId
      }), 
    }).send(res);
  }
  // QUERY // 
  getListProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list product for user success !",
      metadata: await ProductServiceV2.searchProductByUser({
        keySearch:req.params.keySearch
      }), 
    }).send(res);  
  };

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success AllDraftsForShop !",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop:req.user.userId
      }), 
    }).send(res);  
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success AllPublishedForShop !",
      metadata: await ProductServiceV2.findAllPublishedForShop({
        product_shop:req.user.userId
      }), 
    }).send(res);  
  };

  // PUT // 
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Published product successfully !",
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop:req.user.userId,
        product_id:req.params.id
      }), 
    }).send(res);  
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unpublished product successfully !",
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop:req.user.userId,
        product_id:req.params.id
      }), 
    }).send(res);  
  };

}



module.exports = new ProductController();
