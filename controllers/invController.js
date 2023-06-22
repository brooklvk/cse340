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

// Build management view 
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.getClassificationOption()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    options,
  })
}

/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add inventory view 
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.getClassificationOption()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    options,
    errors: null,
  })
}

/* ****************************************
*  Process add classification 
* *************************************** */
invCont.enterClassification = async function (req, res) {
  const { classification_name } = req.body

  const classificationResult = await invModel.enterClassification(classification_name)
  let nav = await utilities.getNav()

  if (classificationResult) {
      req.flash(
          "notice",
          `Congratulations, you\'ve entered the new classification ${classification_name}.`
        )
        res.status(201).render("./inventory/add-classification", {
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
invCont.enterInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const inventoryResult = await invModel.enterInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (inventoryResult) {
      req.flash(
          "notice",
          `Congratulations, you\'ve entered the new item ${inv_make} ${inv_model}.`
        )
        let options = await utilities.getClassificationOption()
        res.status(201).render("./inventory/add-inventory", {
          title: "Add Inventory",
          nav,
          options,
          errors: null,
        })
      } else {
        req.flash("notice", "Sorry, the new item failed.")
        let options = await utilities.getClassificationOption()
        res.status(501).render("inventory/add-inventory", {
          title: "Add Inventory",
          nav,
          options,
          errors: null,
        })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Deliver edit inventory view 
* *************************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const options = await utilities.getClassificationOption()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = invCont 
