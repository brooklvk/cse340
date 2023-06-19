// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route for account login 
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for registration form 
router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/", utilities.handleErrors(accountController.buildManagement));
// utilities.checkLogin,

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;