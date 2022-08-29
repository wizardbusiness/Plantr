
const plants = {
  spiderPlant: 'Spider Plant'
}

const plantController = {
  getPlant: (req, res, next) => {
    if (plants[req.body.plant]) {
      res.locals.plant = plants[req.body.plant]
      return next();
    } 
    return next({
      method: 'controller',
      type: 'missing option',
      err: console.log('key sent on req.locals doesn\'t match key on options db obj.')
    });
  }
}
 

module.exports = plantController.getPlant