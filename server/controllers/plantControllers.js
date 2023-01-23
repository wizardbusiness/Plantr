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
      watering_schedule,
      watering_time_of_day,
      next_water_date,
      fertilizer_schedule,
      fertilizing_time_of_day,
      next_fertilize_date
    } = req.body;

    const { days: w_days, weeks: w_weeks, months: w_months } = watering_schedule;
    const { morning: w_morning, midday: w_midday, evening: w_evening } = watering_time_of_day;
    const { days: f_days, weeks: f_weeks, months: f_months } = fertilizer_schedule;
    const { morning: f_morning, midday: f_midday, evening: f_evening } = fertilizing_time_of_day;
    try {
      if (!name) throw new Error('name field required');
      const data = await db.query(
        `WITH p_vals AS (
          INSERT INTO plants
          (name, light, soil, fertilizer, notes, mist)
          VALUES
          ($1, $2, $3, $4, $5, $6)
          RETURNING plant_id
        ), w_sched_vals AS (
          INSERT INTO watering_schedule
          (plant_id, days, weeks, months, morning, midday, evening, next_water_date)
          SELECT plant_id, $7, $8, $9, $10, $11, $12, $13
          FROM p_vals
        )
        INSERT INTO fertilizer_schedule
        (plant_id, days, weeks, months, morning, midday, evening, next_fertilize_date)
        SELECT plant_id, $14, $15, $16, $17, $18, $19, $20
        FROM p_vals
        RETURNING plant_id;`, 
        [
          name, light, soil, fertilizer, notes, mist, w_days, w_weeks, w_months, w_morning,
          w_midday, w_evening, next_water_date, f_days, f_weeks, f_months, f_morning, f_midday,
          f_evening, next_fertilize_date
        ]
      ); // img
        res.locals.newPlant = data.rows[0];
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
      watering_schedule,
      watering_time_of_day,
      next_water_date,
      fertilizer_schedule,
      fertilizing_time_of_day,
      next_fertilize_date
    } = req.body;
    const { days: w_days, weeks: w_weeks, months: w_months } = watering_schedule;
    const { morning: w_morning, midday: w_midday, evening: w_evening } = watering_time_of_day;
    const { days: f_days, weeks: f_weeks, months: f_months } = fertilizer_schedule;
    const { morning: f_morning, midday: f_midday, evening: f_evening } = fertilizing_time_of_day;
    try {
      const data = await db.query(
        `WITH p_vals AS (
          UPDATE plants SET name = $2, light = $3, soil = $4, fertilizer = $5, notes = $6, mist = $7
          WHERE plant_id = $1 
          RETURNING plant_id
        ), w_vals AS (
          UPDATE watering_schedule SET days = $8, weeks = $9, months = $10, morning = $11, midday = $12, evening = $13, next_water_date = $14 
          WHERE watering_schedule.plant_id = plant_id
        )
        UPDATE fertilizer_schedule SET days = $15, weeks = $16, months = $17, morning = $18, midday = $19, evening = $20,  next_fertilize_date = $21
        WHERE fertilizer_schedule.plant_id = plant_id
        RETURNING plant_id;`,
        [
          plant_id, name, light, soil, fertilizer, notes, mist, w_days, w_weeks, w_months, w_morning,
          w_midday, w_evening, next_water_date, f_days, f_weeks, f_months, f_morning, f_midday,
          f_evening, next_fertilize_date
        ]
      ); // img
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
