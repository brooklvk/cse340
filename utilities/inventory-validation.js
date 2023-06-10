
const utilities = require(".")
const { body, validationResult } = require("express-validator")
// const invModel = require("../models/inventory-model")

const validate = {}

// Classification data validation rules 
validate.addClassificationRules = () => {
    return [

    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body 
    let errors = [] 
    errors = validationResult(req)
}

validate.addInventoryRules


validate 

