import React, {Component} from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import PlantView from './plantView';
import NewPlantForm from './NewPlantForm';
// import '../App.css';

// const plants = ['spider plant', 'prayer plant', 'sword fern']

class App extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {
    return (
      <div>
        <PlantView />
        <NewPlantForm />
      </div>
    )
  }
}

  

// root.render(<Time />)

export default App;


