const utilities = require("../utilities/index")
const managementModel = require("../models/management-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver add classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver add inventory view 
* *************************************** */
async function buildAddInventory(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process add classification 
* *************************************** */
async function enterClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const classificationResult = await managementModel.enterClassification(classification_name)

    if (classificationResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve entered the new classification ${classification_name}.`
          )
          res.status(201).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
          })
        } else {
          req.flash("notice", "Sorry, the new classification failed.")
          res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
          })
    }
}

/* ****************************************
*  Process add inventory
* *************************************** */
async function enterInventory(req, res) {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    const inventoryResult = await managementModel.enterInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

    if (inventoryResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve entered the new item ${inv_make} ${inv_model}.`
          )
          res.status(201).render("inventory/detail", {
            title: inv_make + " " + inv_model,
            nav,
            errors: null,
          })
        } else {
          req.flash("notice", "Sorry, the new item failed.")
          res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: null,
          })
    }
}

module.exports = { buildAddClassification, buildAddInventory, enterClassification, enterInventory }