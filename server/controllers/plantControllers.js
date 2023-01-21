const db = require('../models/plantModel.js');

const plantControllers = {
  async getAllPlants (req, res, next) {
    try { 
      const data = await db.query(
        `SELECT pl.*, 
          f.days AS f_days, 
          f.weeks AS f_weeks, 
          f.months AS f_months, 
          f.morning AS f_morning,
          f.midday AS f_midday,
          f.evening AS f_evening,
          next_fertilize_date,
          w.days AS w_days, 
          w.weeks AS w_weeks, 
          w.months AS w_months,
          w.morning AS w_morning,
          w.midday AS w_midday,
          w.evening AS w_evening,
          next_water_date
        FROM plants pl 
        JOIN fertilizer_schedule f ON pl.plant_id = f.plant_id
        JOIN watering_schedule w on pl.plant_id = w.plant_id;
      `);
      res.locals.plants = data.rows;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }, 

  async addPlant (req, res, next) {
    const { 
      name, 
      img, 
      light, 
      soil, 
      fertilizer, 
      notes,
      mist, 
      fertilizer_schedule,
      watering_schedule,
      next_water_date, 
      next_fertilize_date, 
    } = req.body;
    const { days: w_days, weeks: w_weeks, months: w_months } = watering_schedule;
    const { days: f_days, weeks: f_weeks, months: f_months } = fertilizer_schedule;
    try {
      if (!name) throw new Error('name field required');
      const data = await db.query(
        `WITH p_vals AS (
          INSERT INTO plants
          (name, img, light, soil, fertilizer, notes, mist)
          VALUES
          ($1, 2, $3, $4, 5, $6, $7)
          RETURNING plant_id;
        ), w_sched_vals AS (
          INSERT INTO watering_schedule
          (days, weeks, months, next_water_date)
          SELECT plant_id, $8, $9, $10, $11
          FROM p_vals
        )
        INSERT INTO fertilizer_schedule
        (days, weeks, months, next_fertilize_date)
        SELECT plant_id, $12, $13, $14, $15
        FROM p_vals;
        `, 
         [name, img, light, soil, fertilizer, notes, mist, w_days, w_weeks, w_months, next_water_date, f_days, f_weeks, f_months, next_fertilize_date]); // fertilizeDate
        res.locals.newPlant = data.rows[0];
        console.log(res.locals.newPlant)
        next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
      const { 
        plant_id,
        name, 
        img, 
        light, 
        soil, 
        fertilizer, 
        notes,
        mist, 
        fertilizer_schedule,
        watering_schedule,
        next_water_date, 
        next_fertilize_date, 
      } = req.body;

    const { days: w_days, weeks: w_weeks, months: w_months } = watering_schedule;
    const { days: f_days, weeks: f_weeks, months: f_months } = fertilizer_schedule;// waterDate, fertilizeDate
    try {
      const data = await db.query(
        `WITH p_vals AS (
          UPDATE plants SET name = $2, img = $3, light = $4, soil = $5, fertilizer = $6, notes = $7, mist = $8
          WHERE plant_id = $1 
          RETURNING plant_id
        ), f AS (
          UPDATE watering_schedule SET morning = $9 days = $10, weeks = $11, months = $12, next_water_date = $13 
          WHERE watering_schedule.plant_id = plant_id;
        )
        UPDATE fertilizer_schedule SET morning = $14 days = $15, weeks = $16, months = $17, next_water_date = $18
        WHERE fertilizer_schedule.plant_id = plant_id`
        [plant_id, name, img, light, soil, fertilizer, notes, mist, w_days, w_weeks, w_months, next_water_date, f_days, f_weeks, f_months, next_fertilize_date]);
      res.locals.editedPlant = data.rows[0];
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
