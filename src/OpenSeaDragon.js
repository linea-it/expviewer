import React from 'react';
import './index.css';
import Websocket from "./websocket/websocket";

import OpenSeadragonLib from 'openseadragon';

/*eslint-disable */
const lsstFOV = [
  ['NNN', 'NNN', 'NNN', '168', '169', '170', '177', '178', '179', '186', '187', '188', 'NNN', 'NNN', 'NNN'],
  ['NNN', 'NNN', 'NNN', '165', '166', '167', '174', '175', '176', '183', '184', '185', 'NNN', 'NNN', 'NNN'],
  ['NNN', 'NNN', 'NNN', '162', '163', '164', '171', '172', '173', '180', '181', '182', 'NNN', 'NNN', 'NNN'],
  ['123', '124', '125', '132', '133', '134', '141', '142', '143', '150', '151', '152', '159', '160', '161'],
  ['120', '121', '122', '129', '130', '131', '138', '139', '140', '147', '148', '149', '156', '157', '158'],
  ['117', '118', '119', '126', '127', '128', '135', '136', '137', '144', '145', '146', '153', '154', '155'],
  ['078', '079', '080', '087', '088', '089', '096', '097', '098', '105', '106', '107', '114', '115', '116'],
  ['075', '076', '077', '084', '085', '086', '093', '094', '095', '102', '103', '104', '111', '112', '113'],
  ['072', '073', '074', '081', '082', '083', '090', '091', '092', '099', '100', '101', '108', '109', '110'],
  ['033', '034', '035', '042', '043', '044', '051', '052', '053', '060', '061', '062', '069', '070', '071'],
  ['030', '031', '032', '039', '040', '041', '048', '049', '050', '057', '058', '059', '066', '067', '068'],
  ['027', '028', '029', '036', '037', '038', '045', '046', '047', '054', '055', '056', '063', '064', '065'],
  ['NNN', 'NNN', 'NNN', '006', '007', '008', '015', '016', '017', '024', '025', '026', 'NNN', 'NNN', 'NNN'],
  ['NNN', 'NNN', 'NNN', '003', '004', '005', '012', '013', '014', '021', '022', '023', 'NNN', 'NNN', 'NNN'],
  ['NNN', 'NNN', 'NNN', '000', '001', '002', '009', '010', '011', '018', '019', '020', 'NNN', 'NNN', 'NNN']
];
/*eslint-enable */

class OpenSeaDragon extends React.Component {
  state = {
    ccd: false,
    raft: false,
    ccds: [],
    rafts: [],
    images: [],
    positions: {},
  };

  getImages = images => {
    console.log("getImages: ", images)
    images.forEach(im => {
      console.log(im);
      im = im.replace('.tif', '')
      if (!this.state.images.includes(im)) {
        const x = this.state.positions[im][0];
        const y = this.state.positions[im][1];
        this.addImage(x, y, im);
      }
    })

    this.setState({ images });
  }

  test = () => {
    // console.log(this.state);

    // this.viewer.destroy();
    // this.initSeaDragon();
    // this.renderImages();
    // console.log(this.viewer.viewport)
  }

  saveRef = ref => {
    this.socket = ref;
  }

  getAllImages = () => {
    this.socket.state.ws.send("getAllImages");
  };

  clearImages = () => {
    this.viewer.destroy();
    this.initSeaDragon();
    this.setState({ images: [] });
    this.socket.state.ws.send("clearImages");
  };

  findImages = () => {
    this.socket.state.ws.send("findImages");
  };

  render() {
    return (
      <div
        className="ocd-div"
        ref={node => {
          this.el = node;
        }}
      >
        <Websocket getImages={this.getImages} saveRef={this.saveRef} />
        <div className="navigator-wrapper c-shadow">
          <div id="navigator" />
        </div>
        <div className="openseadragon" id="ocd-viewer" />
        <ul className="ocd-toolbar">
          <li>
            {/* eslint-disable-next-line*/}
            <a onClick={this.clearImages}>
              <i className="fa fa-eraser" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a onClick={this.findImages}>
              <i className="fa fa-play" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a onClick={this.showRaft}>
              <i className="fa fa-th-large" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a onClick={this.showCcd}>
              <i className="fa fa-th" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a id="zoom-in">
              <i className="fa fa-plus" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a id="reset">
              <i className="fa fa-circle" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a id="zoom-out">
              <i className="fa fa-minus" />
            </a>
          </li>
          <li>
            {/* eslint-disable-next-line*/}
            <a id="full-page">
              <i className="fa fa-desktop" />
            </a>
          </li>
        </ul>
      </div>
    );
  }

  showRaft = async () => {
    if (!this.state.raft) {
      this.setState({ raft: true });
      let count, line, position;
      count = 0;
      line = 0;
      position = 0;
      const rafts = [];
      lsstFOV.forEach(lineArr => {
        lineArr.forEach(el => {
          if (el !== 'NNN') {
            const raft = this.addRaftOverlay(position, line, el);
            rafts.push(raft);
            count = count + 1;
          }
          position = position + 1;
        });
        position = 0;
        line = line + 1;
      });
      this.setState({ rafts: rafts });
    } else {
      this.state.rafts.forEach(raft => {
        this.viewer.removeOverlay(raft);
      });
      this.setState({ raft: false, rafts: [] });
    }
  };

  addRaftOverlay = (x, y) => {
    const raft = document.createElement('div');
    raft.className = 'raft-overlay';
    if (x % 3 === 0 && y % 3 === 0) {
      raft.textContent = `(${x / 3},${4 - y / 3})`;
      this.viewer.addOverlay({
        element: raft,
        location: new OpenSeadragonLib.Rect(x, y, 3, 3),
        rotationMode: OpenSeadragonLib.OverlayRotationMode.BOUNDING_BOX,
      });
    }
    return raft;
  };

  addCcdOverlay = (x, y, name) => {
    const ccd = document.createElement('div');
    ccd.className = 'ccd-overlay';
    ccd.textContent = name;
    this.viewer.addOverlay({
      element: ccd,
      location: new OpenSeadragonLib.Rect(x, y, 1, 1),
      rotationMode: OpenSeadragonLib.OverlayRotationMode.BOUNDING_BOX,
    });
    return ccd;
  };

  showCcd = async () => {
    if (!this.state.ccd) {
      this.setState({ ccd: true });
      let count, line, position;
      count = 0;
      line = 0;
      position = 0;
      const ccds = [];
      lsstFOV.forEach(lineArr => {
        lineArr.forEach(el => {
          if (el !== 'NNN') {
            const ccd = this.addCcdOverlay(position, line, el);
            ccds.push(ccd);
            count = count + 1;
          }
          position = position + 1;
        });
        position = 0;
        line = line + 1;
      });
      this.setState({ ccds: ccds });
    } else {
      this.state.ccds.forEach(ccd => {
        this.viewer.removeOverlay(ccd);
      });
      this.setState({ ccd: false, ccds: [] });
    }
  };

  addCcdOverlay = (x, y, name) => {
    const ccd = document.createElement('div');
    ccd.className = 'ccd-overlay';
    ccd.textContent = name;
    this.viewer.addOverlay({
      id: 'ccd',
      element: ccd,
      location: new OpenSeadragonLib.Rect(x, y, 1, 1),
      rotationMode: OpenSeadragonLib.OverlayRotationMode.BOUNDING_BOX,
    });
    return ccd;
  };

  initSeaDragon = () => {
    this.viewer = OpenSeadragonLib({
      id: 'ocd-viewer',
      visibilityRatio: 0.01,
      constrainDuringPan: false,
      defaultZoomLevel: 0.04,
      minZoomLevel: 0.04,
      homeFillsViewer: true,
      maxZoomLevel: 400,
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      homeButton: 'reset',
      fullPageButton: 'full-page',
      nextButton: 'next',
      showNavigator: true,
      navigatorId: 'navigator',
      // debugMode: true,
      tileSources: [],
    });
  };

  addImage = (x, y, name) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `http://expviewer.linea.gov.br/iipserver?IIIF=exps/${name}.tif`
        : `${window.origin}/iipserver?IIIF=exps/${name}.tif`;
    this.viewer.addTiledImage({
      tileSource: {
        '@context': './context.json',
        '@id': url,
        height: 4150,
        width: 4150,
        protocol: 'http://iiif.io/api/image',
        tiles: [
          {
            scaleFactors: [1, 2, 4, 8, 16, 32, 64, 128, 256],
            width: 4150,
            tileOverlap: 0,
          },
        ],
      },
      x: x,
      y: y,
    });
  };

  renderImages = () => {
    let count, line, position;
    count = 0;
    line = 0;
    position = 0;
    lsstFOV.forEach(lineArr => {
      lineArr.forEach(el => {
        if (el !== "NNN" && this.state.images.includes(el)) {
          this.addImage(position, line, el);
          count = count + 1;
        }
        position = position + 1;
      });
      position = 0;
      line = line + 1;
    });
  };

  mapPositions = () => {
    let y, x;
    y = 0;
    x = 0;
    const positions = {}
    lsstFOV.forEach(lineArr => {
      lineArr.forEach(el => {
        if (el !== "NNN") {
          positions[el] = [x, y]
        }
        x = x + 1;
      });
      x = 0;
      y = y + 1;
    });
    this.setState({ positions })
  }

  componentDidMount() {
    this.mapPositions();
    this.initSeaDragon();
    this.renderImages();
  }
}

export default OpenSeaDragon;
