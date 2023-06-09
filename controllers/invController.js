const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId 
  const data = await invModel.getInventoryDetailsByInventoryId(inventory_id)
  const detailGrid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const classMake = data[0].inv_make
  const classModel = data[0].inv_model
  res.render("./inventory/detail", {
    title: classMake + " " + classModel,
    nav,
    detailGrid
  })
}

module.exports = invCont