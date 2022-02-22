const { ValidationError } = require('../utility/errorHandler.js')
const db = require('../utility/db.js');
const crypto = require('crypto-js');
const { string } = require('joi');


//checking user credential
async function isUserExist(email, password, next) {
    let passwordMd5Hash = crypto.MD5(password);
    let query = 'select * from customers where email=$1 and password=$2'
    let value = [email, "" + passwordMd5Hash]

    let result = await db.executeWithParameter(query, value)
    if (result.rows.length == 1) {
        return result.rows
    }
    else {

        next(new ValidationError('Authentication Failed'))
        return []
    }


}

//get data of order details

async function getCart(email, fields = '') {
    if (fields.length == 0) {
        fields = 'id,name,contact,gender,address,product_model,product_name,availability,rating,type'
    }
    if (fields.search('email') != -1) {
        fields = fields.replace("email", "c.email");

    }
    if (fields.search('product_id') != -1) {
        fields = fields.replace("product_id", "p.product_id");
    }


    let query = `SELECT ${fields}
                FROM customers c JOIN customers_orders o 
                ON c.email=o.email 
                JOIN products p 
                ON o.product_id=p.product_id 
                WHERE c.email='${email}'`


    let result = await db.execute(query)
    return result

}

//get data of pagiation filter and sort 
const getAll = async (...rest) => {
     rest[4] = rest[4].length>0 ? rest[4] : 'Product_id';
    let generateQuery = {

        0: `rating BETWEEN ${rest[0]} AND 5`,
        1: `type like'%${rest[1]}%'`,

        2: `product_price BETWEEN ${rest[2]} AND (SELECT MAX(product_price) FROM products)`,
        3: `product_name like '%${rest[3]}%' `,



    }
    //console.log(rest);
    let query = ''

    for (let data = 0; data < rest.length - 1; data++) {
        let str = typeof rest[data]

        if (str == 'string') {
            if (rest[data].length > 0) {
                query += generateQuery[data] + ' and '

            }
        } else {
            if (isNaN(rest[data]) == false) {
                query += generateQuery[data] + ' and '

            }
        }

    }
    // console.log(query);

    if (query !== '') {
        query = 'where ' + query
        query = query.slice(0, query.length - 4)
        
        query = query + `ORDER BY ${rest[4]} ASC`
    }
    //console.log(query);


    let mainQuery = ` SELECT * 
                FROM products ${query}`

    let result = await db.execute(mainQuery)
    return result

}



module.exports = { isUserExist, getCart, getAll }