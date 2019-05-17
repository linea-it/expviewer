import React, { Component } from 'react';
import Connection from './connection';
import PropTypes from 'prop-types';

class Socket extends Component {
  static propTypes = {
    saveRef: PropTypes.func.isRequired,
    getImages: PropTypes.func.isRequired,
  };

  state = {
    images: [],
    connected: "No"
  };

  handleData = data => {
    const result = JSON.parse(data);
    if (result && result.status) this.setState({ connected: "Yes" });
    if (result && result.images) {
      this.props.getImages(result.images);
      this.setState({ images: result.images });
    }
    // console.log(result);
  };

  handleConnection = connected => {
    this.setState({ connected });
  };

  render() {
    // const url =
    //     process.env.NODE_ENV === 'development'
    //         ? process.env.REACT_APP_WEBSOCKET
    //         : window.origin.replace('http', 'ws');

    const url = "ws://localhost:5678/ws";
    return (
      <div>
        {/* <p onClick={this.getAllImages}>GET</p>
        <p onClick={this.clearImages}>CLEAR</p>
        <p onClick={this.findImages}>FIND</p>
        <p>Connected: {this.state.connected}</p> */}
        <Connection
          ref={this.props.saveRef}
          url={url}
          onMessage={this.handleData}
          onOpen={() => this.handleConnection("ok")}
          onClose={() => this.handleConnection("no")}
          //   onOpen={this.props.connected}
          //   onClose={this.props.disconnected}
          debug={true}
        />
      </div>
    );
  }
}

export default Socket;
