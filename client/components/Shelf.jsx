import React, {useState, useEffect} from "react";

function Shelf({plants}) {

  function buildShelf() {
    // builds a shelf section for each plant
    return plants.map((plant, index) => {
      const key = `s${index}`
      return (
      <div className='shelf' key={key}>
        <img height='25px' width='205px' src='images/shelfSection.svg'/>
      </div>
      )
    })
    }
  
  return (
    <div className='shelf-container'>
      {buildShelf()}
    </div>
  )
}

export default Shelf;