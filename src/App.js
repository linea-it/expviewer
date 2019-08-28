import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import OpenSeaDragon from './OpenSeaDragon';
import OpenSeaDragonPaused from './OpenSeaDragonPaused';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={OpenSeaDragon} />
        <Route path="/paused/:image" component={OpenSeaDragonPaused} />
      </Router>
    );
  }
}

export default App;
