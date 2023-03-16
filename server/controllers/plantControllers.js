const db = require('../models/plantModel.js');

const plantControllers = {
  async getAllPlants (req, res, next) {
    try { 
      const data = await db.query(
        `SELECT pl.*, 
          f.unselected_time as f_unselected_time,
          f.days AS f_days, 
          f.weeks AS f_weeks, 
          f.months AS f_months, 
          f.morning AS f_morning,
          f.midday AS f_midday,
          f.evening AS f_evening,
          next_fertilize_date,
          initial_fertilize_date,
          w.unselected_time AS w_unselected_time,
          w.days AS w_days, 
          w.weeks AS w_weeks, 
          w.months AS w_months,
          w.morning AS w_morning,
          w.midday AS w_midday,
          w.evening AS w_evening,
          next_water_date,
          initial_water_date
        FROM plants pl 
        JOIN fertilizer_schedule f ON pl.plant_id = f.plant_id
        JOIN watering_schedule w on pl.plant_id = w.plant_id;
      `);
      const processedData = data.rows.map(plant => {
        const processedPlant = { 
          wateringSched: {}, 
          wateringTime: {},
          fertilizeSched: {}, 
          fertilizeTime: {}
        };
        for (const property in plant) {
          if (property[0] === 'w') {
            const processedProperty = property.replace(/^w_/, '');
            if (property === 'w_days' || property === 'w_weeks' || property === 'w_months') {
              processedPlant.wateringSched[processedProperty] = plant[property];
            } else if (property === 'w_morning' || property === 'w_midday' || property === 'w_evening' || property === 'unselected_time') {
              processedPlant.wateringTime[processedProperty] = plant[property];
            };
          } else if (property[0] === 'f') {
            const processedProperty = property.replace(/^f_/, '');
            if (property === 'f_days' || property === 'f_weeks' || property === 'f_months') {
              processedPlant.fertilizeSched[processedProperty] = plant[property];
            } else if (property === 'f_morning' || property === 'f_midday' || property === 'f_evening' || property === 'unselected_time') {
              processedPlant.fertilizeTime[processedProperty] = plant[property];
            };
          } else {
            const processedProperty = property.replace(/(_\w)|(_)/g, function (m, g1) {
              return g1 ? g1[1].toUpperCase() : '';
            });
            processedPlant[processedProperty] = plant[property]; 
          };
        };
        return processedPlant;
      });

      res.locals.plants = processedData;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  }, 

  async addPlant (req, res, next) {
    const {
      currSortId,
      plant_species,
      name,
      img, 
      light, 
      soil, 
      fertilizer, 
      notes, 
      mist,
      wateringSched,
      wateringTime,
      initialWaterDate,
      nextWaterDate,
      fertilizeSched,
      fertilizeTime,
      initialFertilizeDate,
      nextFertilizeDate,
    } = req.body;
    const { days: wDays, weeks: wWeeks, months: wMonths } = wateringSched;
    const { unselected_time: wUnselectedTime, morning: wMorning, midday: wMidday, evening: wEvening } = wateringTime;
    const { days: fDays, weeks: fWeeks, months: fMonths } = fertilizeSched;
    const { unselectedTime: fUnselectedTime, morning: fMorning, midday: fMidday, evening: fEvening } = fertilizeTime;
    try {
      if (!plant_species) throw new Error('plant_species field required');
      const data = await db.query(
        `WITH p_vals AS (
          INSERT INTO plants
          (sort_id, plant_species, name, light, soil, fertilizer, notes, mist)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING plant_id
        ), w_sched_vals AS (
          INSERT INTO watering_schedule
          (plant_id, days, weeks, months, unselected_time, morning, midday, evening, next_water_date, initial_water_date)
          SELECT plant_id, $9, $10, $11, $12, $13, $14, $15, $16, $17
          FROM p_vals
        )
        INSERT INTO fertilizer_schedule
        (plant_id, days, weeks, months, unselected_time, morning, midday, evening, next_fertilize_date, initial_fertilize_date)
        SELECT plant_id, $18, $19, $20, $21, $22, $23, $24, $25, $26
        FROM p_vals
        RETURNING plant_id;`, 
        [
          currSortId, plantSpecies, name, light, soil, fertilizer, notes, mist, wDays, wWeeks, wMonths, wUnselectedTime, wMorning,
          wMidday, wEvening, nextWaterDate, initialWaterDate, fDays, fWeeks, fMonths, fUnselectedTime, fMorning, fMidday, fEvening, 
          nextFertilizeDate, initialFertilizeDate
        ]
      ); // img
        res.locals.newPlant = data.rows[0];
        next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async updateSortOrder(req, res, next) {
    const {prevSortOrder, nextSortOrder} = req.body;
    try {
      const data = await db.query(
        `UPDATE plants 
         SET 
          sort_id = (array[${nextSortOrder.join(', ')}])[array_position(array[${prevSortOrder.join(', ')}], sort_id)]
         WHERE sort_id = ANY(array[${prevSortOrder.join(', ')}])
         RETURNING plants;`
      );
      res.locals.updatedOrder = data.rows;
      console.log(res.locals.updatedOrder)
      next();
    } catch(err) {
      console.log(err);
      next(err);
    }
  },

  async editPlant (req, res, next) {
      const {
        plantId,
        plantSpecies,
        name,
        img, 
        light, 
        soil, 
        fertilizer, 
        notes, 
        mist,
        wateringSched,
        wateringTime,
        initialWaterDate,
        nextWaterDate,
        fertilizeSched,
        fertilizeTime,
        initialFertilizeDate,
        nextFertilizeDate,
    } = req.body;

    const { days: wDays, weeks: wWeeks, months: wMonths } = wateringSched;
    const { unselected_time: wUnselectedTime, morning: wMorning, midday: wMidday, evening: wEvening } = wateringTime;
    const { days: fDays, weeks: fWeeks, months: fMonths } = fertilizeSched;
    const { unselectedTime: fUnselectedTime, morning: fMorning, midday: fMidday, evening: fEvening } = fertilizeTime;
    try {
      if (!plantId) throw new Error('plant id required for editing')
      const data = await db.query(
        `WITH p_vals AS (
          UPDATE plants SET plant_species = $2, name = $3, light = $4, soil = $5, fertilizer = $6, notes = $7, mist = $8
          WHERE plant_id = $1 
          RETURNING plant_id
        ), w_vals AS (
          UPDATE watering_schedule SET unselected_date = $9, days = $10, weeks = $11, months = $12, unselected_time = $13, morning = $14, midday = $15, evening = $16, next_water_date = $17, initial_water_date = $18 
          WHERE watering_schedule.plant_id = (SELECT plant_id FROM p_vals)
        )
        UPDATE fertilizer_schedule SET unselected_date = $19, days = $20, weeks = $21, months = $22, unselected_time = $23, morning = $24, midday = $25, evening = $26,  next_fertilize_date = $27, initial_fertilize_date = $28
        WHERE fertilizer_schedule.plant_id = (SELECT plant_id FROM p_vals)
        RETURNING plant_id;`,
        [
          plantId, plantSpecies, name, light, soil, fertilizer, notes, mist, wDays, wWeeks, wMonths, wUnselectedTime, wMorning,
          wMidday, wEvening, nextWaterDate, initialWaterDate, fDays, fWeeks, fMonths, fUnselectedTime, fMorning, fMidday, fEvening, 
          nextFertilizeDate, initialFertilizeDate
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
    const { plantId } = req.params;
    console.log(plantId)
    try {
      // CASCADE is on in SQL- deleting plant in plants table deletes it in the schedule table too. 
      const data = await db.query('DELETE FROM plants WHERE plant_id = $1 RETURNING plant_id', [plantId]);
      res.locals.deletedPlant = data;
      // console.log(res.locals.deletedPlant);
      next();
    } catch(err) {
      next(err);
    }
  },
}
 

module.exports = plantControllers;
