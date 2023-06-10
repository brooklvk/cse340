// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const managementController = require("../controllers/managementController")
const validate = require('../utilities/management-validation')

// Route for adding classification 
router.get("/add-classification", utilities.handleErrors(managementController.buildAddClassification))

// Route for adding to inventory 
router.get("/add-inventory", utilities.handleErrors(managementController.buildAddInventory))

// Process adding classification 
router.post(
    "/add-classification",
    validate.enterClassificationRules(),
    validate.checkClassificationData(),
    utilities.handleErrors(managementController.enterClassification)
  )  

// Process adding to inventory 
router.post(
    "/add-inventory",
    validate.enterInventoryRules(),
    validate.checkInventoryData(),
    utilities.handleErrors(managementController.enterInventory)
)

module.exports = router;