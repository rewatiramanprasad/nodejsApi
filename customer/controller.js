const sqlController = require('./sqlController.js')
const responseStructure = require('../utility/responseStructure.js')
const jwt = require('jsonwebtoken');
const privateData = require('../config/config.json')
const auth = require('../utility/auth.js')



const login = async (req, res, next) => {

    try {
        const { email, password } = req.body

        let data = await sqlController.isUserExist(email, password, next)
        if (data.length == 1) {
            const token = await auth.authentication(email, privateData['secret-key'])
            const result = responseStructure.response(token, true, "token created successfully")
            res.status(200).send(result).end()
        }
    }
    catch (e) {
        next(e)
    }

}

const cart = async (req, res, next) => {
    try {
        let { fields } = req.query
        let token = auth.isTokenExist(req.headers.authorization, next)
        if (token) {
            const decoded = jwt.verify(token, privateData['secret-key']);
            let result = await sqlController.getCart(decoded.email, fields,)
            result = responseStructure.response(result, true)
            res.status(200).send(result).end()
        }
    }
    catch (e) {
        next(e)
    }

}


const productList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        let sort = req.query.sort
        let rating = parseInt(req.query.rating)
        let type = req.query.type
        let product_price = parseInt(req.query.product_price)
        let product_name = req.query.product_name


        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const data = await sqlController.getAll(rating = rating, type = type, product_price = product_price, product_name = product_name,sort=sort)

        let result = data.slice(startIndex, endIndex)
        result=responseStructure.response(result,true)
        res.status(200).send(result).end()

    }
    catch (e) {
        next(e)
    }

}




module.exports = { login, cart, productList }