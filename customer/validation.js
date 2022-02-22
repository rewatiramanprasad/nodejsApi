
const Joi = require('joi');
const { ValidationError } = require('../utility/errorHandler');

// checking validation of user and password
const isValidLoginCredential = async (req, res, next) => {

    const data = req.body
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().required()

    })
    const valid = await schema.validate(data)

    if (valid.error) {
        console.log(valid.error);
        next(new ValidationError(valid.error))
    }
    else {
        next()
    }

}

module.exports = { isValidLoginCredential }