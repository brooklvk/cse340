const pool = require("../database/")

/* *****************************
*   Add new classification 
* *************************** */
async function enterClassification(classification_name){
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing classification 
 * ********************* */
async function checkExistingClassification(classification_name){
    try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1"
      const classification = await pool.query(sql, [classification_name])
      return classification.rowCount
    } catch (error) {
      return error.message
    }
}

/* *****************************
*   Add new inventory
* *************************** */
async function enterInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
      const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing inventory
 * ********************* */
async function checkExistingInventory(inv_id){
    try {
      const sql = "SELECT * FROM inventory WHERE inv_id = $1"
      const inventory = await pool.query(sql, [inv_id])
      return inventory.rowCount
    } catch (error) {
      return error.message
    }
}

module.exports = { enterClassification, checkExistingClassification, enterInventory, checkExistingInventory };