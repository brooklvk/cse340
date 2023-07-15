const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
        throw new Error("Email exists. Please log in or use different email.")
      }
    }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}
  
/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
        return new Error("Email does not exist. Please register or use different email.")
      }
    }),

    // password must follow previous requirements (cannot check because is hashed)
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/*  **********************************
 *  Check login data and proceed to login 
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
    const account_id = body.account_id 
    const account = accountModel.getAccountById(account_id) 
    if (!account_email == account.account_email) { 
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
      throw new Error("Email exists. Please use a different email.")
      }
    }})
  ]
}

/* ******************************
* Check data and return errors or continue to account update page 
* ***************************** */
validate.checkAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account-update", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Change password validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue to account update page 
* ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/account-update", {
      errors,
      title: "Update Account",
      nav,
      account_password
    })
    return
  }
  next()
}

validate.sendMessageRules = () => {
  return [
    // recipient 
    body("message_to")
    .trim()
    .isLength({max: 5})
    .withMessage("The recipient must be valid."),

    // message subject 
    body("message_subject")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Subject must be longer than two characters."), // on error this message is sent.

    // message body 
    body("message_body")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Body must be longer than two characters."), // on error this message is sent.
  ]
}

validate.checkMessageData = async (req, res, next) => {
  const { message_to, message_subject, message_body } = req.body
  let errors = []
  errors = validationResult(req)

  const account_id = res.locals.accountData.account_id 
  const allMessages = await accountModel.getAllMessages(account_id)
  let numArchived = 0;
  allMessages.forEach(message => {
    if (message.message_archived) {
      numArchived += 1
      }
    }
  );
  res.locals.numArchived = numArchived;

  const inboxData = await accountModel.getMessageData(account_id)
  const table = await utilities.buildMessageTable(inboxData)

  if (!errors.isEmpty() && typeof(message_to)==typeof(0)) {
    let nav = await utilities.getNav()
    res.render("account/inbox", {
      title: res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname + " Inbox",
      nav,
      table,
      errors: null,
      numArchived,
      message_subject,
      message_body
    })
    return
  }
  next()
}

module.exports = validate