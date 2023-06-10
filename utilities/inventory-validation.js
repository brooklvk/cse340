
const utilities = require(".")
const { body, validationResult } = require("express-validator")
// const invModel = require("../models/inventory-model")

const validate = {}

// Classification data validation rules 
validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({min: 2, max: 20})
        .withMessage("Name must be between 2 and 20 characters."),
        // .custom(async (classification_name) => {
        //     const exists = await invModel.checkExistingClassification(classification_name)
        //     if (exists){
        //       throw new Error("Classification exists already. Try again.")
        //     }
        //   })
    ]
}

// Check data for errors then add classification 
validate.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body 
    let errors = [] 
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return 
    }
    next()
}

// Inventory data validation rules 
validate.addInventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .isLength({min: 3})
        .withMessage("Invalid vehicle make."),

        body("inv_model")
        .trim()
        .isLength({min: 3})
        .withMessage("Invalid vehicle model."),

        body("inv_year")
        .trim()
        .isLength({minmax: 4})
        .withMessage("Invalid vehicle year."),

        body("inv_description")
        .trim()
        .isLength({max: 100})
        .withMessage("Invalid vehicle description"),

        body("inv_image")
        .trim()
        .isLength({min: 4})
        .withMessage("Invalid image."),

        body("inv_thumbnail")
        .trim()
        .isLength({min: 4})
        .withMessage("Invalid thumbnail."),

        body("inv_price")
        .trim()
        .isLength({min: 2, max: 12})
        .withMessage("Invalid price."),

        body("inv_miles")
        .trim()
        .isLength({min: 3, max: 6})
        .withMessage("Invalid mileage."),

        body("inv_color")
        .trim()
        .isLength({min: 2})
        .withMessage("Invalid color.")
    ]
}


validate.checkInventoryData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_miles, inv_color, 
        classification_id,} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let options = await utilities.getClassificationOption()
        res.render("./inventory/add-inventory", {
            errors, 
            title: "Add Inventory",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, 
            inv_thumbnail, inv_price, inv_miles, inv_color, 
            classification_id,
            options 
        })
        return 
    }
    next()
}


module.exports = validate 