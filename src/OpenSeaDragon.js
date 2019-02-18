import React from 'react';
import './index.css';

import OpenSeadragonLib from 'openseadragon';

const lsstFOV = [
    ['NNN', 'NNN', 'NNN', '065', '068', '071', '110', '113', '116', '155', '158', '161', 'NNN', 'NNN', 'NNN'],
    ['NNN', 'NNN', 'NNN', '064', '067', '070', '109', '112', '115', '154', '157', '160', 'NNN', 'NNN', 'NNN'],
    ['NNN', 'NNN', 'NNN', '063', '066', '069', '108', '111', '114', '153', '156', '159', 'NNN', 'NNN', 'NNN'],
    ['020', '023', '026', '056', '059', '062', '101', '104', '107', '146', '149', '152', '182', '185', '188'],
    ['019', '022', '025', '055', '058', '061', '100', '103', '106', '145', '148', '151', '181', '184', '187'],
    ['018', '021', '024', '054', '057', '060', '099', '102', '105', '144', '147', '150', '180', '183', '186'],
    ['011', '014', '017', '047', '050', '053', '092', '095', '098', '137', '140', '143', '173', '176', '179'],
    ['010', '013', '016', '046', '049', '052', '091', '094', '097', '136', '139', '142', '172', '175', '178'],
    ['009', '012', '015', '045', '048', '051', '090', '093', '096', '135', '138', '141', '171', '174', '177'],
    ['002', '005', '008', '038', '041', '044', '083', '086', '089', '128', '131', '134', '164', '167', '170'],
    ['001', '004', '007', '037', '040', '043', '082', '085', '088', '127', '130', '133', '163', '166', '169'],
    ['000', '003', '006', '036', '039', '042', '081', '084', '087', '126', '129', '132', '162', '165', '168'],
    ['NNN', 'NNN', 'NNN', '029', '032', '035', '074', '077', '080', '119', '122', '125', 'NNN', 'NNN', 'NNN'],
    ['NNN', 'NNN', 'NNN', '028', '031', '034', '073', '076', '079', '118', '121', '124', 'NNN', 'NNN', 'NNN'],
    ['NNN', 'NNN', 'NNN', '027', '030', '033', '072', '075', '078', '117', '120', '123', 'NNN', 'NNN', 'NNN']
];

class OpenSeaDragon extends React.Component {
    render() {
        let { id } = this.props
        return (
          <div
            className="ocd-div"
            ref={node => {
              this.el = node;
            }}
          >
            <div className="navigator-wrapper c-shadow">
              <div id="navigator" />
            </div>
            <div className="openseadragon" id={id} />
            <ul className="ocd-toolbar">
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

    initSeaDragon = async () => {
        let self = this
        let { id } = this.props
        self.viewer = OpenSeadragonLib({
            id: id,
            visibilityRatio: 1.0,
            constrainDuringPan: false,
            defaultZoomLevel: 0.04,
            minZoomLevel: 0.04,
            maxZoomLevel: 400,
            zoomInButton: "zoom-in",
            zoomOutButton: "zoom-out",
            homeButton: "reset",
            fullPageButton: "full-page",
            nextButton: "next",
            previousButton: "previous",
            showNavigator: true,
            navigatorId: "navigator",
            tileSources: [],
        });
    }

    addImage = (x,y,name) => {
        this.viewer.addTiledImage({
          tileSource: {
            "@context": "./context.json",
            // "@id": `${window.origin}/iipserver?IIIF=exps/${name}.tif`,
            "@id": `http://expviewer.linea.gov.br/iipserver?IIIF=exps/${name}.tif`,
            height: 4010,
            width: 4010,
            protocol: "http://iiif.io/api/image",
            tiles: [
              {
                scaleFactors: [1, 2, 4, 8, 16, 32, 64, 128, 256],
                width: 4010
              }
            ]
          },
          x: x,
          y: y
        });
    }

    pad = (num, size) => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    renderImages = () => {
        let count, line, position;
        count = 0;
        line = 0;
        position = 0;
        lsstFOV.forEach(lineArr => {
          lineArr.forEach(el => {
            if (el !== 'NNN') {
              // const padNum = this.pad(count, 3);
              // console.log(el)
              this.addImage(position, line, el);
              count = count + 1;
            }
            position = position + 1;
          });
          position = 0;
          line = line + 1;
        });
    }

    componentDidMount() {
        this.initSeaDragon()
        this.renderImages();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
}

OpenSeaDragon.defaultProps = { id: 'ocd-viewer', type: 'legacy-image-pyramid' }

export default OpenSeaDragon;

