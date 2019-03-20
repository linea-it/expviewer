import React, { Component } from 'react';
import Connection from './connection';
// import PropTypes from 'prop-types';

class Socket extends Component {
  // static propTypes = {
  //     connected: PropTypes.func.isRequired,
  //     disconnected: PropTypes.func.isRequired,
  // };

  handleData = data => {
    // const result = JSON.parse(data);

    console.log(data);
  };

  storeWebsocketRef = socket => {
    this.socket = socket;
  };

  render() {
    // const url =
    //     process.env.NODE_ENV === 'development'
    //         ? process.env.REACT_APP_WEBSOCKET
    //         : window.origin.replace('http', 'ws');

    const url = 'ws://localhost:5678';
    return (
      <div>
        <Connection
          ref={this.storeWebsocketRef}
          url={url}
          onMessage={this.handleData}
          //   onOpen={this.props.connected}
          //   onClose={this.props.disconnected}
          debug={true}
        />
      </div>
    );
  }
}

export default Socket;
