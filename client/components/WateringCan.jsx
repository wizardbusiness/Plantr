import React, {useState, useEffect, useRef} from 'react';
import Shelf from './Shelf';
import '../../src/styles.css';




export default function WateringCan({waterPlant, handleWaterPlant}) {
  const [ isDragging, setIsDragging ] = useState(false);
  const [ isWatering, setIsWatering ] = useState(false);
  const [ canOnShelf, setCanOnShelf ] = useState(true);
  const [ divStyle, setDivStyle ] = useState({
    top: 800,
    left: 850,
    width: 150,
    height: 125,
  });

  const shelfRef = useRef(null);
  const wateringCanRef = useRef(null);

  useEffect(() => {
    isDragging ? setDivStyle(prevStyle => {
      return {
        ...prevStyle,
        cursor: 'grabbing'
      }
    }) : setDivStyle(prevStyle => {
      return {
        ...prevStyle,
        cursor: 'grab'
      }
    })
  }, [isDragging])

  function handleMouseDown() {
    if (canOnShelf) {
      isDragging === false ? setIsDragging(true) : setIsDragging(false);
    } 
    else if (!canOnShelf) {
      isWatering === false ? setIsWatering(true) : setIsWatering(false);
      setDivStyle(prevStyle =>{
        return {
          ...prevStyle,
          transform: 'rotate(-50deg)'
        }
      })
    }
  }

  function handleMouseUp() {
    if (!canOnShelf) {
      isWatering === false ? setIsWatering(true) : setIsWatering(false);
      setDivStyle(prevStyle =>{
        return {
          ...prevStyle,
          transform: 'rotate(-35deg)'
        }
      })
    }
  }

  function handleMouseMove(e) {
    const shelfRect = shelfRef.current.getBoundingClientRect();
    const wateringCanRect = wateringCanRef.current.getBoundingClientRect();
    const height = wateringCanRect.height
    const width = wateringCanRect.width;
    const leftCornerX = wateringCanRect.x;
    const leftCornerY = wateringCanRect.y;
    const centerX = leftCornerX + width / 2;
    const centerY = leftCornerY + height / 2;
    setCanOnShelf(
      shelfRect.top < centerY &&
      shelfRect.bottom > centerY &&
      shelfRect.left < centerX &&
      shelfRect.right > centerX
    )

    if (isDragging) {
      const x = e.clientX - divStyle.width / 2;
      const y = e.clientY - divStyle.width / 2;
      setDivStyle( prevStyle => {
        return {
          ...prevStyle,
          position: 'absolute',
          top: y,
          left: x
        }
      });
      if (canOnShelf) {
        setDivStyle(prevStyle =>{
          return {
            ...prevStyle,
            transform: 'rotate(0deg)'
          }
        })
      } else if (!canOnShelf && !isWatering) {
          setDivStyle(prevStyle =>{
            return {
              ...prevStyle,
              transform: 'rotate(-35deg)'
            }
          })
      }
    } else if (!isDragging) {
      setDivStyle( prevStyle => {
        return {
          ...prevStyle,
          position: 'static'
        }
      })
    }
    
  }


  // when watering can is clicked, it will set watering mode to true. 
  // when watering mode is true, clicking on a plant will fire the waterPlant method. 
  // this will set the initial date watered to current, and rebuild the schedule based off what has been set by the user.


  return (
    // style={{"--active": waterPlant ? "#88d1fb;" : "#2ac9c4"}}
    <div className='table-and-dropzone-container'>   
      <div 
        className='watering-can-dropzone'
        ref={shelfRef}
        style={{
        // backgroundColor: 'red',
        
      }}>
          <img 
          className='watering-can'
          ref={wateringCanRef}
          style={divStyle}
          src='/images/wateringCanGrey.svg' 
          onClick={() => handleWaterPlant()}
          onMouseDown={() => handleMouseDown()}
          onMouseUp={(e) => handleMouseUp()}
          onMouseMove={(e) => handleMouseMove(e)}
          />
      </div>
      <img 
        className='table'
        src='./images/table.svg'
      />
    
    </div>
    
  )
}