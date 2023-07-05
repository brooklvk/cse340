const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

// Deliver account management view 
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Manage Account",
    nav,
    errors: null,
  });
}

// Deliver account update forms within management view 
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-update", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

// Deliver inbox view (access through account manage page)
// async function buildInbox(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("account/inbox", {
//     title: "(username) Inbox",
//     nav,
//     errors: null,
//   });
// }

// Deliver archive view (access through inbox page)
async function buildArchive(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/archive", {
    title: "(username) Archives",
    nav,
    errors: null,
  });
}

// Deliver message view (access through inbox OR archive)
async function buildMessage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/message", {
    title: "(Subject)",
    nav,
    errors: null,
  });
}

// Deliver new message view (access thru inbox page OR message page)
async function buildNewMessage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/new-message", {
    title: "New Message",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
       hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }
  
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/account-management")
   }
  } catch (error) {
   return new Error("Access Forbidden")
  }
}

/* ****************************************
*  Process Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const accResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
  )
  const accById = await accountModel.getAccountById(account_id)
  res.locals.accountData = accById
  console.log(accById)
  console.log(res.locals.accountData.account_firstname)
  if (accResult && accById) {
    utilities.deleteCookie;
    const accountData = await accountModel.getAccountById(account_id);
    accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000});
    res.cookie("jwt", accessToken, {httpOnly: true});
    req.flash(
      "notice",
      `You\'ve updated your account.`
    )
    res.status(201).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process change password 
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      req.flash("notice", "Sorry, the password change failed.")
      res.status(500).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      })
  }

  const accResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  )

  if (accResult) {
    req.flash(
      "notice",
      `You\'ve changed your password.`
    )
    res.status(201).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build message table by account_id/message_to view 
 * ************************** */
async function buildMessagesByAccountId (req, res, next) {
  console.log("This runs!")
  const account_id = parseInt(req.params.accountId.slice(1,3))
  console.log(account_id)
  const messageData = await accountModel.getMessageData(account_id)
  console.log(messageData)
  const table = await utilities.buildMessageTable(messageData)
  console.log("table" + table)
  let nav = await utilities.getNav()
  res.render("account/inbox", {
    title: messageData[0].account_firstname + " " + messageData[0].account_lastname + " Inbox",
    nav,
    table,
    errors: null,
  })
}

module.exports = { buildLogin, buildRegister, buildManagement, buildUpdate, buildArchive, buildMessage, buildNewMessage, registerAccount, accountLogin, updateAccount, changePassword, buildMessagesByAccountId }
