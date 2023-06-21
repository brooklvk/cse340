/* ******************************************
 * This is the application server
 * Require statements 
 * ******************************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())

/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ******************************************
 * Routes 
 * ***************************************** */

app.use(require("./routes/static"))

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory route
app.use("/inv", require("./routes/inventoryRoute"))

// Account route
app.use("/account", require("./routes/accountRoute"))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page."})
})

app.use(utilities.checkJWTToken)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oops. We crashed.'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ******************************************
 * Local server information 
 Values from .env(environment) file
 * ***************************************** */
const host = process.env.HOST
const port = process.env.PORT

/* ***********************
* Log statement to confirm server operation
* *********************** */
app.listen(port, () => {
console.log(`app listening on ${host}:${port}`)
});



// Assn 4
//Obj 1 CSS needs to be added to clean up the appearance of the views. 2 HTML errors in new inventory item view. 
//Obj 5 The messages should be displayed in the inventory management view after adding a new inventory item.

// Unit 5 
// Accepts all emails even not registered, and wrong passwords too 



//in add-inventory view:
// change values to value="<%- locals." so it brings in current data for update view
//dont change til assn: -editing not accessible unless logged in as employee/admin (its ok if you can access as client!for now)
// from account-mgmt page: welcome, links you can access (edit-inv,edit-class if management/adnim) and account updates for everyone 


// Logins 
// account_firstname: Basic
// account_lastname: Client
// account_email: basic@340.edu
// account_password: I@mABas1cCl!3nt
// account_firstname: Happy
// account_lastname: Employee
// account_email: happy@340.edu
// account_password: I@mAnEmpl0y33
// account_firstname: Manager
// account_lastname: User
// account_email: manager@340.edu
// account_password: I@mAnAdm!n1strat0r

// Issues: 
// Does not create JWT cookie 
// Does not actually check for email/pass in db 
// /inv view, select doesn't bring up data 
