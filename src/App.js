import React, { Component } from 'react';
import Console from './components/Console'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state= {
      showName: {visibility: "hidden"},
      name: false,
      color: "white"
    }
  }

  render() {
    return (

              <Console colors={this.state.color} />

    );
  }
}

export default App;
