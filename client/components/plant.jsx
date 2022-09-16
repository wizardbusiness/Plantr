
import React, { Component } from 'react';
import '../../src/styles.css';



class Plant extends Component {
  constructor(props) {
    super(props)

    this.waterPlant = this.waterPlant.bind(this);
  }

  componentDidMount() {
    
    setTimeout(() => {
      console.log(`${this.props.name} needs watering`)
    }, 3000)
  }

  waterPlant() {
    console.log(`${this.props.name} watered!`)
  }

  
  render() {
    return (
      <div className="plant" onClick={() => {
        this.waterPlant;
      }}>{this.props.name}</div>
    )
  }
}

export default Plant;