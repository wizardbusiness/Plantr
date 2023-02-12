import React from 'react';
import '../../src/styles.css';


export default function WateringCan({waterPlant, handleWaterPlant}) {
  // when watering can is clicked, it will set watering mode to true. 
  // when watering mode is true, clicking on a plant will fire the waterPlant method. 
  // this will set the initial date watered to current, and rebuild the schedule based off what has been set by the user.
  return (
    // style={{"--active": waterPlant ? "#88d1fb;" : "#2ac9c4"}}
    <div className="watering-can" onClick={() => handleWaterPlant()} style={{"--active": waterPlant ? "#0047b8" : "#17a7ba"}} ></div>
  )
}