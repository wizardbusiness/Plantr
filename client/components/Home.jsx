import React, {Component} from 'react';
import PlantView from './PlantView';
import WateringCan from './WateringCan';
// import '../App.css';

// const plants = ['spider plant', 'prayer plant', 'sword fern']

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      waterPlant: false
    }
    this.handleWaterPlant = this.handleWaterPlant.bind(this);
  }

  handleWaterPlant() {
    this.setState({waterPlant: this.state.waterPlant === false ? true : false}, () => console.log(this.state));
  }
  
  render() {
    return (
      <div className="outside-of-planter">
        <PlantView waterPlant={this.state.waterPlant}/>
        <WateringCan waterPlant={this.state.waterPlant} handleWaterPlant={this.handleWaterPlant} />
      </div>
    )
  }
}

  

// root.render(<Time />)

export default App;


