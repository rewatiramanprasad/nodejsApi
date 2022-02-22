const jwt = require('jsonwebtoken');
const { ValidationError } = require('./errorHandler');

//
const authentication = async (email, secretkey) => {
   
    //for expire { expiresIn: '30000' }

    let token = jwt.sign({ email }, secretkey)
    data = { token: token }
    return data
}

const isTokenExist=(token,next)=>{

    if (token){
        return token.split(' ')[1]
    }
    else{
        next(new ValidationError('plz proide token'))
    }

}


module.exports = { authentication,isTokenExist }