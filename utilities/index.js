const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data) {
  let detailGrid
  if (data.length > 0) {
    data.forEach(vehicle => {
    detailGrid = '<div id="inv-details">'
    detailGrid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
    + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
    + 'details"><img src="' + vehicle.inv_image
    +'" alt="Img of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motorzz" /></a>'
    detailGrid += '<div class="namePrice">'
    detailGrid += '<hr />'
    detailGrid += '<h2>'
    detailGrid += '</h2>'
    detailGrid += '<span>$' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    detailGrid += '<p>Year: ' + vehicle.inv_year + '</p>'
    detailGrid += '<p>' + vehicle.inv_description + '</p>'
    detailGrid += '<p>Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
    detailGrid += '</div>'
    detailGrid += '</div>'
    })
    } else { 
    detailGrid += '<p class="notice">Sorry, no matching vehicles could be found!</p>'
  }
  return detailGrid
}

Util.getClassificationOption = async function(req, res, next) {
  let data = await invModel.getClassifications()
  let opt = '<select name="classification_id">'
  opt += '<option value="0">Select Classification</option>'
  data.rows.forEach((row) => {
    opt += '<option value=' + row.classification_id + '>' 
    + row.classification_name + '</option>'
  })

  opt += '</select>'

  return opt 
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

module.exports = Util