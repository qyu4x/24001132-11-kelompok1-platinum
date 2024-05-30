const Joi = require("joi");

const createProductValidation = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    price: Joi.number().min(100).required(),
    stock: Joi.number().min(1).required(),
    is_preorder: Joi.boolean().required().default(false),
    description: Joi.string().min(5).required()
})

const getProductValidation = Joi.string().uuid().required();

const searchProductValidation = Joi.object({
    title: Joi.string().min(1),
    categoryId: Joi.string(),
    subCategoryId: Joi.string(),
    page: Joi.number().required(),
    size: Joi.number().required()
})

const updateProductValidation = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    price: Joi.number().min(100).required(),
    stock: Joi.number().min(1).required(),
    category_id: Joi.string().uuid().required(),
    sub_category_id: Joi.string().uuid().required(),
    is_preorder: Joi.boolean().required().default(false),
    description: Joi.string().min(5).required()
})

const updateStockProductValidation= Joi.number().min(1).required();
module.exports = {
    createProductValidation,
    getProductValidation,
    searchProductValidation,
    updateProductValidation,
    updateStockProductValidation
}