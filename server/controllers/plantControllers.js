const db = require('../models/plantModel.js');

const plantControllers = {
  async getAllPlants (req, res, next) {
    try { 
      const data = await db.query(
        'SELECT * FROM plants INNER JOIN schedule ON plants.plant_id = schedule.plant_id;');
      res.locals.plants = data.rows;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }, 
  

  // get info about one plant from the database
  async getAPlant (req, res, next) {
    const { plantId }= req.params;
    console.log(plantId)
    try {
      const data = await db.query(
        `SELECT p.plant_id, p.name, p.img, p.light, p.fertilizer, p.soil, p.notes, 
          s.days, s.weeks, s.months, s.morning, s.evening, s.midday, s.mist, s.water_date, s.fertilize_date
        FROM plants p
        INNER JOIN schedule s 
        ON (p.plant_id = s.plant_id) WHERE p.plant_id = $1;`, 
        [plantId]);
      res.locals.plant = data.rows;
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async addPlant (req, res, next) {
    const { name, img, light, soil, fertilizer, notes, days, weeks, months, morning, evening, mid, mist, waterDate, fertilizeDate } = req.body;
    try {
      if (!name) throw new Error('name field required');
      const data = await db.query(
        `WITH p_vals AS (
          INSERT INTO plants 
            (name, img, light, soil, fertilizer, notes)
          VALUES
            ($1, $2, $3, $4, $5, $6)
            RETURNING plant_id
          ) 
          INSERT INTO schedule
            (plant_id, days, weeks, months, morning, evening, mid, mist)
            SELECT plant_id, $7, $8, $9, $10, $11, $12, $13
            FROM p_vals
            RETURNING plant_id;`, 
         [name, img, light, soil, fertilizer, notes, days, weeks, months, morning, evening, mid, mist]); // waterDate, fertilizeDate
        res.locals.newPlant = data.rows[0];
        next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
    const { plant_id, name, img, light, soil, fertilizer, notes, days, weeks, months, morning, evening, mid, mist } = req.body; // waterDate, fertilizeDate
    console.log(req.body)
    try {
      const data = await db.query(
        `WITH p_vals AS (
          UPDATE plants SET name = $2, img = $3, light = $4, soil = $5, fertilizer = $6, notes = $7
            WHERE plant_id = $1 RETURNING *)
         UPDATE schedule SET days = $8, weeks = $9, months = $10, morning= $11, evening = $12, mid = $13, mist = $14
          WHERE plant_id = $1 RETURNING *;`, 
          [plant_id, name, img, light, soil, fertilizer, notes, days, weeks, months, morning, evening, mid, mist]); // waterDate, fertilizeDate
      res.locals.editedPlant = data.rows[0];
      console.log(res.locals.editedPlant);
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async deletePlant (req, res, next) {
    const { plant_id } = req.params;
    console.log(plant_id)
    try {
      // CASCADE is on in SQL- deleting plant in plants table deletes it in the schedule table too. 
      const data = await db.query('DELETE FROM plants WHERE plant_id = $1 RETURNING plant_id', [plant_id]);
      res.locals.deletedPlant = data;
      // console.log(res.locals.deletedPlant);
      next();
    } catch(err) {
      next(err);
    }
  },
}
 

module.exports = plantControllers;