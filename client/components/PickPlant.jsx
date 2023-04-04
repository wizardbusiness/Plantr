import React, {useState, useEffect} from 'react';

function PickPlant({plantImgData, setPlantImg}) {
  const [ imagesLoaded, setImagesLoaded ] = useState(false);
  const [ showImages, setShowImages ] = useState(false);
  const [ pickedImage, setPickedImage ] = useState({});
  const [ searchablePlants, setSearchablePlants] = useState([]);
  const [ searchText, setSearchText] = useState('')
  const [ filteredSearchResults, setFilteredSearchResults ] = useState([]);

  function handleToggleShowImages() {
    showImages === true ? setShowImages(false) : setShowImages(true);
    return;
  }

  

  useEffect(() => {
    const plantNames = plantImgData.map(data => data.plantSpecies);
    setSearchablePlants(plantNames)
    setFilteredSearchResults(plantNames)
    if (plantImgData.length > 0) setImagesLoaded(true);
  }, [plantImgData])

  useEffect(() => {
    filterSearchResults(searchText);
  }, [searchText])
  useEffect(() => {
    
  })

  function filterSearchResults(input) {
    const filteredResults = searchablePlants.filter(string => string.includes(input));
    setFilteredSearchResults(filteredResults);
  }

  function renderSearchResults() {
    const results = plantImgData.map((data, index) => {
      if (filteredSearchResults.includes(data.plantSpecies)) return (
        <div onClick={() => {
            handleToggleShowImages()
            setPickedImage(data)
            setPlantImg(data)
          }}
          key={index}>
          <span>
            <img 
              className='plant-img' 
              key={index} 
              width='100' 
              height='100'
              src={data.plantSvgSrc} 
              alt='plant'
            />
            <code>{data.plantSpecies}</code>
          </span>
        </div>
      );
    });
    return results;
  }
  
  return (
    <div className='form-text-field'>
      <label className='field-label'>Species:&nbsp;</label>
      {imagesLoaded &&
        <span>
          <img 
            className='new-plant-img'
            onClick={() => handleToggleShowImages()}
            src={pickedImage.plantSvgSrc || plantImgData[0].plantSvgSrc}
          />
        </span> 
      }
      { showImages &&
        <div className='img-pick-bg'> 
          <input 
            className='field-input'
            placeholder='...search for plants' 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)}
          />
          {renderSearchResults()}
        </div>
      }
    </div>
    );  
}

export default PickPlant;