// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Route for account login 
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for registration form 
router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/account-management", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

router.get("/account-update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate));

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the update (name/email)
router.post(
  "/update-account",
  validate.updateAccountRules(),
  validate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process change password 
router.post(
  "/update-password",
  validate.changePasswordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)  
)

module.exports = router;