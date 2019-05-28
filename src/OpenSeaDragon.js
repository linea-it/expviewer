import React from 'react';
import './index.css';
import Websocket from './websocket/websocket';

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
    image_name: '',
    positions: {},
    status_name: '',
    status_class: '',
    total_images: [],
  };

  getImageName = img => {
    // console.log('getImageName(%o)', img);
    return img.replace(img.substr(-8), '');
  };

  getImages = images => {
    console.log('getImages: ', images);
    const img_name = this.getImageName(images[0]);

    if (this.state.image_name !== img_name) {
      console.log('Image Name: %o', img_name);
      console.log('Imagem anterior: %o', this.state.image_name);

      this.setState(
        { image_name: img_name, images: [], total_images: [] },
        () => {
          console.log('Callback troca de imagem.');

          this.clearImages();

          this.getImages(images);
        }
      );
    } else {
      images.forEach((im, xx) => {
        xx = im.replace('.tif', '');
        xx = xx.split('-')[2];

        if (!this.state.images.includes(xx)) {
          const x = this.state.positions[xx][0];
          const y = this.state.positions[xx][1];
          this.addImage(x, y, im);
          this.state.total_images.push(im);
        }
      });

      this.setState({
        images: images,
      });
    }
  };

  saveRef = ref => {
    this.socket = ref;
  };

  getAllImages = () => {
    console.log('getAllImages()');
    this.socket.state.ws.send('getAllImages');
  };

  clearImages = () => {
    console.log('clearImages()');
    // console.log(this.state)
    this.viewer.navigator.destroy();
    this.viewer.destroy();
    this.viewer = null;
    this.initSeaDragon();
    // this.setState({ images: [] });
    // this.socket.state.ws.send('clearImages');
  };

  // findImages = () => {
  //   this.socket.state.ws.send('findImages');
  // };

  onChangeStatus = status => {
    let status_name = '';
    let status_class = '';
    switch (status) {
      case 'ok':
        status_name = 'Connected';
        status_class = 'websocket-status success';
        break;
      case 'no':
        status_name = 'Closed';
        status_class = 'websocket-status warning';
        break;
      case 'receive':
        status_name = 'Received Message';
        status_class = 'websocket-status info';
        break;
    }
    this.setState({
      status_name: status_name,
      status_class: status_class,
    });
  };

  render() {
    return (
      <div
        className="ocd-div"
        ref={node => {
          this.el = node;
        }}
      >
        <div className="top-toolbar">
          <div className="image_name">{this.state.image_name}</div>
          <div className="vertical-center">
            <span className={this.state.status_class}>
              {this.state.status_name}
            </span>
          </div>
        </div>
        <Websocket
          getImages={this.getImages}
          saveRef={this.saveRef}
          status={this.onChangeStatus}
        />
        <div className="navigator-wrapper c-shadow">
          <div id="navigator" />
        </div>
        <div className="openseadragon" id="ocd-viewer" />
        <ul className="ocd-toolbar">
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
        {/* <div className="bottom-toolbar">
          <div className="vertical-center">
            <span className={this.state.status_class}>
              {this.state.status_name}
            </span>
          </div>
        </div> */}
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
        ? `${process.env.REACT_APP_IIPSERVER}/iipserver?IIIF=${name}`
        : `${window.origin}/iipserver?IIIF=${name}`;
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
        if (el !== 'NNN' && this.state.images.includes(el)) {
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
    const positions = {};
    lsstFOV.forEach(lineArr => {
      lineArr.forEach(el => {
        if (el !== 'NNN') {
          positions[el] = [x, y];
        }
        x = x + 1;
      });
      x = 0;
      y = y + 1;
    });
    this.setState({ positions });
  };

  componentDidMount() {
    this.mapPositions();
    this.initSeaDragon();
    this.renderImages();
  }
}

export default OpenSeaDragon;
