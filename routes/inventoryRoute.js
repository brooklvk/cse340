// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view 
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Build management view 
router.get("/", utilities.checkManagerLogin, utilities.handleErrors(invController.buildManagement));

// Route for adding classification 
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route for adding to inventory 
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route for getting inventory by class id 
router.get("/add-inventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route for editing inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Route for deleting inventory item
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDelete))

// Process adding classification 
router.post(
    "/add-classification",
    validate.enterClassificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.enterClassification)
  )  

// Process adding to inventory 
router.post(
    "/add-inventory",
    validate.enterInventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.enterInventory)
)

// Process updating inventory 
router.post("/update/", 
validate.enterInventoryRules(), 
validate.checkUpdateData, 
utilities.handleErrors(invController.updateInventory))


// Process deleting an item 
router.post("/delete/", 
utilities.handleErrors(invController.deleteInventory))

module.exports = router;