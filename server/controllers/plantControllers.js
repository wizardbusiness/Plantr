const db = require('../models/plantModel.js');

const plantControllers = {
  async getAllPlants (req, res, next) {
    try { 
      const data = await db.query('SELECT * FROM Plants');
      res.locals.plants = data.rows;
      next()
    } catch (err) {
      console.log(err);
      next(err);
    }
  }, 
  

  // get info about one plant from the database
  async getAPlant (req, res, next) {
    const { id }= req.params;
    console.log(id)
    try {
      const data = await db.query(
        `SELECT * FROM Plants WHERE id = $1`, [id]
      )
      res.locals.plant = data.rows;
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async addPlant (req, res, next) {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = req.body;
    try {
      // console.log(id)
      // console.log(name)
      if (!name) throw new Error('name field required');
      const data = await db.query('INSERT INTO Plants (id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
        [id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes]);
        res.locals.newPlant = data.rows;
        console.log(res.locals.newPlant)
        next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes } = req.body;

    console.log('id' + id)
    try {
      const data = await db.query('UPDATE Plants SET name = $2, water_at_date = $3, fertilize_at_date = $4, light_pref = $5, soil_pref = $6, fertilizer_pref = $7, notes = $8 WHERE id = $1 RETURNING *', 
        [id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes]);
      res.locals.editedPlant = data.rows;
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async deletePlant (req, res, next) {
    const { id } = req.params;

    try {
      const data = await db.query('DELETE FROM Plants WHERE id = $1 RETURNING id' , [id]);
      res.locals.deletedPlant = data.rows[0];
      next();
    } catch(err) {
      next(err);
    }
  },
}
 

module.exports = plantControllers;