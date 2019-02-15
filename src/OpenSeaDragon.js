import React from 'react';
import './index.css';

import OpenSeadragonLib from 'openseadragon';

const lsstFOV = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
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
            maxZoomLevel: 10,
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
                "@id": `${window.origin}/iipserver?IIIF=exps/${name}.tif`,
                height: 4000,
                width: 4000,
                protocol: "http://iiif.io/api/image",
                tiles: [
                    {
                        scaleFactors: [1, 2, 4, 8, 16, 32],
                        width: 4000
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
            if (el !== 0) {
              const padNum = this.pad(count, 3);
              this.addImage(line, position, padNum);
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

