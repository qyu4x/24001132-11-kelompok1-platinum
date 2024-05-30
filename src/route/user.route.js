const userHandler = require('../handler/user.handler.js');
const {authorize} = require('../middleware/auth.middleware');

const userRouter = require('express').Router();

userRouter.post('/', userHandler.register);
userRouter.post('/login', userHandler.login);
userRouter.post('/logout', authorize(['USER', 'ADMIN']), userHandler.logout);
userRouter.get('/current', authorize(['USER', 'ADMIN']), userHandler.get);

module.exports = {
    userRouter
}