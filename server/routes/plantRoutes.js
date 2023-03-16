const express = require('express');
const plantControllers = require('../controllers/plantControllers.js');

const plantRoutes = express.Router();

// Routes 
// Get all plants
plantRoutes.get('/plants', plantControllers.getAllPlants, (req, res, next) => {
  res.status(200).json(res.locals.plants);
});

// Create new plant in db
plantRoutes.post('/plants', plantControllers.addPlant, (req, res, next) => {
  res.status(200).json(res.locals.newPlant);
});

// update sort coords
plantRoutes.patch('/plants', plantControllers.updateSortOrder, (req, res, next) => {
  res.status(200).json(res.locals.updatedOrder);
})

// Edit plant
plantRoutes.put('/plants/:plantId', plantControllers.editPlant, (req, res, next) => {
  res.status(200).json(res.locals.editedPlant);
});

// Delete a plant from the db
plantRoutes.delete('/plants/:plantId', plantControllers.deletePlant, (req, res, next) => {
  res.status(200).json(res.locals.deletedPlant);
});

module.exports = plantRoutes;