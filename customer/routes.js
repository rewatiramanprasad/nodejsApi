
const express = require('express')
const { login, cart, productList } = require('./controller.js')
const { isValidLoginCredential } = require('./validation.js')
const router = express.Router()


router.post('/login', isValidLoginCredential, login)
router.get('/cart', cart)
router.get('/productList', productList)



module.exports = router