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
* Return message data using account id 
* ***************************** */
async function getMessageData (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM message WHERE message_to = $1',
      [account_id])
    return result.rows
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
*   Insert new message 
* *************************** */
async function createMessage(message_from, message_to, message_subject, message_read, message_body, message_received, message_archived, account_id){
  try {
    const sql = "INSERT INTO public.message (message_from, message_to, message_subject, message_read, message_body, message_received, message_archived, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    return await pool.query(sql, [message_from, message_to, message_subject, message_read, message_body, message_received, message_archived, account_id])
  } catch (error) {
    return error.message
  }
  // insert into message values (default, '14', '13', 'Test subject', 'false', 'Test message', '2011-07-01 06:30:30', 'false');
}

/* *****************************
*   Change a message (read)
* *************************** */
async function changeMessageRead(message_read, account_id) {
  try {
    const sql = "UPDATE public.message SET message_read = $1 WHERE account_id = $2"
    const result = await pool.query(sql, [message_read, account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change a message (archived)
* *************************** */
async function changeMessageArchived(message_archived, account_id) {
  try {
    const sql = "UPDATE public.message SET message_archived = $1 WHERE account_id = $2"
    const result = await pool.query(sql, [message_archived, account_id])
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

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, changePassword, getMessageData, createMessage, changeMessageRead, changeMessageArchived, deleteMessage };