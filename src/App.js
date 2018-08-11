import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="top">
        
        <h1 className="title victory"><code> Chris Michels</code></h1>

            <div className="container">

            <div className="row">
            <div className="col-6 about">
             <code><p>FULL STACK DEVELOPER</p>
              <p>HIKER</p>
              <p>CYCLIST</p>
              <p>FLY FISHERMAN</p>
              <p>BLOCKCHAIN ENTHUSIAST</p>
              <p>BOARD GAME GEEK</p></code>
            </div> 

            <div className="col-3"></div>
              <div className="crbn col-3"> <img src="/img/crbn.png" className="crbnimg"/> </div>
            </div>

            <div className="row">
            <div className="col-3"></div>
            <div className="col-3"></div>
            <div className="col-3"></div>
              <div className="crbn col-3"> <img src="/img/crbn.png" className="crbnimg"/> </div>
            </div>

            <div className="row">
            <div className="col-3"></div>
            <div className="col-3"></div>
            <div className="col-3"></div>
              <div className="crbn col-3"> <img src="/img/crbn.png" className="crbnimg"/> </div>


            </div>
          </div>
      </div>
    );
  }
}

export default App;
