const db = require('../models/plantModel.js');

const plantControllers = {
  async getAllPlants (req, res, next) {
    try { 
      const data = await db.query(
        'SELECT * FROM plants INNER JOIN schedule ON plants.plant_id = schedule.plant_id RETURNING *');
      res.locals.plants = data.rows;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }, 
  

  // get info about one plant from the database
  async getAPlant (req, res, next) {
    const { plant_id }= req.params;
    console.log(plant_id)
    try {
      const data = await db.query(
        `SELECT p.plant_id, p.name, p.img, p.light, p.fertilizer, p.soil, p.notes, 
          s.days, s.weeks, s.months, s.morning, s.evening, s.midday, s.mist, s.water_date, s.fertilize_date
        FROM plants p
        INNER JOIN schedule s 
        ON (p.plant_id = s.plant_id) WHERE p.plant_id = $1;`, 
        [plant_id]);
      res.locals.plant = data.rows;
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async addPlant (req, res, next) {
    const { plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilize_date } = req.body;
    try {
      // console.log(plant_id)
      // console.log(name)
      if (!name) throw new Error('name field required');
      const data = await db.query(
        `WITH p_vals AS (
          INSERT INTO plants 
            (plant_id, name, img, light, soil, fertilizer, notes)
          VALUES
            ($1, $2, $3, $4, $6, $7))
         INSERT INTO schedule
           (plant_id, day, week, month, morning, evening, mid, mist, water_date, fertilize_date)
         VALUES
          ($1, $8, $9, $10, $11, $12, $13, $14, $15, $16);`, 
         [plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilize_date]);
        res.locals.newPlant = data.rows;
        console.log(res.locals.newPlant)
        next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
    const { plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilize_date } = req.body;

    console.log('id' + id)
    try {
      const data = await db.query(
        `WITH p_vals AS (
          UPDATE plants SET name = $2, img = $3, light = $4, soil = $5, fertilizer = $6, notes = $7
            WHERE plant_id = $1)
         UPDATE schedule SET day = $8, week = $9, month = $10, morning= $11, evening = $12, mid = $13, mist = $14, water_date = $15, fertilize_date = $16 
          WHERE plant_id = $1;`, 
          [plant_id, name, img, light, soil, fertilizer, notes, day, week, month, morning, evening, mid, mist, water_date, fertilize_date]);
        
      res.locals.editedPlant = data.rows[0];
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async deletePlant (req, res, next) {
    const { id } = req.params;

    try {
      // CASCADE is on in SQL- deleting plant in plants table deletes it in the schedule table too. 
      const data = await db.query('DELETE FROM plants WHERE id = $1 RETURNING id' , [id]);
      res.locals.deletedPlant = data.rows[0];
      next();
    } catch(err) {
      next(err);
    }
  },
}
 

module.exports = plantControllers;