const categoriesService = require('../service/category.service');
const {WebResponse} = require("../payload/response/web.response");

const create = async (req, res, next) => {
    try {
        const request = req.body;

        const categoryResponse = await categoriesService.create(request);
        res.status(200).json(new WebResponse(categoryResponse, null));
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const categoryResponse = await categoriesService.list();
        res.status(200).json(new WebResponse(categoryResponse, null));
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;

        await categoriesService.remove(categoryId);
        res.status(200).json(new WebResponse("OK", null));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    list,
    remove
}