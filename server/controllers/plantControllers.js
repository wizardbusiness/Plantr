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

  async addPlant (req, res, next) {
    const { id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes} = req.body;
    try {
      if (!id || !name) throw new Error('name and id required');
      const data = await db.query('INSERT INTO Plants (id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
        [id, name, water_at_date, fertilize_at_date, light_pref, soil_pref, fertilizer_pref, notes]);
      res.locals.newPlant = data
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
    const { id, name, water_at_date, fertilize_at_date, light__pref, soil_pref, fertilizer_pref, notes} = req.body;
    try {
      const data = await db.query('UPDATE Plants SET id = $1, name = $2, water_at_date = $3, fertilize_at_date = $4, light_pref = $5, soil_pref = $6, fertilizer_pref == $7, notes = $8', 
        [id, name, water_at_date, fertilize_at_date, light__pref, soil_pref, fertilizer_pref, notes]);
      res.locals.editedPlant = data;
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async deletePlant (req, res, next) {
    const { id } = req.params;
    try {
      const data = await db.query('DELETE FROM Plants WHERE id = $1', [id]);
      res.locals.delMsg = 'Plant succesfully deleted';
    } catch(err) {
      next(err);
    }
  },
}
 

module.exports = plantControllers;