'use strict';

exports.__esModule = true;

var _reactLeaflet = require('react-leaflet');

class ExtendedMarker extends _reactLeaflet.Marker {
    componentDidMount(...a) {
        super.componentDidMount(...a);
        setTimeout(() => {
            this.leafletElement.openPopup();
        }, 1);
    }
}
exports.default = ExtendedMarker;