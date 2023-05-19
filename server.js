/* ******************************************
 * This is the application server
 * Require statements 
 * ******************************************/
const express = require("express")

const expressLayouts = require("express-ejs-layouts")

const env = require("dotenv").config()

const app = express()

const baseController = require("./controllers/baseController")

/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ******************************************
 * Default GET route
 * ***************************************** */
// app.get("/", (req, res) => {res.send("Welcome home!")});

app.use(require("./routes/static"))

//Index route 
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// });
app.get("/", baseController.buildHome)

/* ******************************************
 * Server host name and 
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

