import React from 'react';
import { createRoot } from 'react-dom/client';
import Plant from './plant.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <Welcome name="Gabriel"/>
        <Time />
        <Plant />
      </div>
    )
  }
}

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}


class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(), 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
    <div>
      <h1>Time was {this.props.staticDate}</h1>
      <h1>It is {this.state.date.toLocaleTimeString()}</h1>
    </div>
    )
  }
}

const container = document.getElementById('root')
const root = createRoot(container)

// root.render(<Time />)

export default App;


