const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
*   Update account
* *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4;"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change password 
* *************************** */
async function changePassword(account_password, account_id) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2;"
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return message data for inbox using account id 
* ***************************** */
async function getMessageData (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM message JOIN account ON message.message_from = account.account_id WHERE message_to = $1 AND message_archived = false',
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No matching messages found")
  }
}

/* *****************************
* Return message data for archives by account id 
* ***************************** */
async function getArchiveData (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM message JOIN account ON message.message_from = account.account_id WHERE message_to = $1 AND message_archived = true',
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No matching messages found")
  }
}

/* *****************************
* Return all message data by account id 
* ***************************** */
async function getAllMessages (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM message JOIN account ON message.message_from = account.account_id WHERE message_to = $1',
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No matching messages found")
  }
}

/* *****************************
* Return message data using message id 
* ***************************** */
async function getMessageById (message_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM message JOIN account ON message.message_from = account.account_id WHERE message_id = $1',
      [message_id])
    return result.rows
  } catch (error) {
    return new Error("No matching message found")
  }
}

/* *****************************
*   Insert new message 
* *************************** */
async function createMessage(message_from, message_to, message_subject, message_body, message_received){
  try {
    const sql = "INSERT INTO public.message VALUES (default, $1, $2, $3, 'false', $4, 'false', $5)"
    return await pool.query(sql, [message_from, message_to, message_subject, message_body, message_received])
  } catch (error) {
    return "Error"
  }
  // INSERT INTO message VALUES (default, '14', '13', 'Test Subject', 'false', 'Test message', 'false', '2011-07-01 06:30:30');
}

/* *****************************
*   Change a message (read)
* *************************** */
async function changeMessageRead(message_read, message_id) {
  try {
    const sql = "UPDATE public.message SET message_read = $1 WHERE message_id = $2"
    const result = await pool.query(sql, [message_read, message_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change a message (archived)
* *************************** */
async function changeMessageArchived(message_id) {
  try {
    const sql = "UPDATE public.message SET message_archived = 'true' WHERE message_id = $1"
    const result = await pool.query(sql, [message_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Delete a message 
* *************************** */
async function deleteMessage(account_id) {
  try {
    const sql = "DELETE FROM public.message WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, changePassword, getMessageData, getMessageById, createMessage, changeMessageRead, changeMessageArchived, deleteMessage, getArchiveData, getAllMessages };