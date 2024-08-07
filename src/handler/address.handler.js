const  addressService = require('../service/address.service');
const {WebResponse} = require("../payload/response/web.response");

const create = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const request = req.body;

        const addressResponse = await addressService.create(userId, request);
        res.status(200).json(new WebResponse(addressResponse, null));
    } catch (error) {
        next(error);
    }
}

const list = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const addressResponse = await addressService.list(userId);
        res.status(200).json(new WebResponse(addressResponse, null));
    } catch (error) {
        next(error);
    }
}

const setMain = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.addressId;

        await addressService.setMain(userId, addressId);
        res.status(200).json(new WebResponse("OK", null));
    }catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.addressId;

        await addressService.remove(userId, addressId);
        res.status(200).json(new WebResponse("OK", null));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    list,
    setMain,
    remove
}