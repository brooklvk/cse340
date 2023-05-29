/* ******************************************
 * This is the application server
 * Require statements 
 * ******************************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")//

/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ******************************************
 * Routes 
 * ***************************************** */
// app.get("/", (req, res) => {res.send("Welcome home!")});

app.use(require("./routes/static"))

//Index route 
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// });
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

//file not found 

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()//make utilities in scope 
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
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
console.log(`trial app listening on ${host}:${port}`)
});






// in invController.js

// const classMode1 = data1[0].inv_model
// const classMake = data[0].inv_make 
// res.render("filepath", {
//   title: classMake + " " + classMode1, 
//   nav, 
//   grid, 
// })
