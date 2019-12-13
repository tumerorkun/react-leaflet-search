import { Control, DomUtil, DomEvent, icon } from "leaflet";
import React from "react";
// import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Popup, MapControl, Marker } from "react-leaflet";
import { SearchControl } from "./search-control";
export default class ReactLeafletSearch extends MapControl {
    constructor(props, context) {
        var _a;
        super(props);
        this.handler = ({ event, payload }) => {
            if (event === "add") {
                payload && this.latLngHandler(payload.latlng, payload.info, payload.raw);
            }
            else {
                this.removeMarkerHandler();
            }
        };
        this.div = DomUtil.create("div", "leaflet-search-wrap");
        DomEvent.disableClickPropagation(this.div);
        DomEvent.disableScrollPropagation(this.div);
        this.state = {
            search: false,
            info: false
        };
        this.markerIcon = icon({
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        this.SearchInfo = null; // searched lat,lng or response from provider
        this.map = context.map || ((_a = props.leaflet) === null || _a === void 0 ? void 0 : _a.map);
        this.markerRef = React.createRef();
    }
    createLeafletElement(props) {
        const ReactLeafletSearchControl = Control.extend({
            onAdd: (map) => this.div,
            onRemove: (map) => { }
        });
        return new ReactLeafletSearchControl(props);
    }
    latLngHandler(latLng, info, raw) {
        this.SearchInfo = { info, latLng, raw };
        const popUpStructure = (React.createElement("div", null,
            React.createElement("p", null, Array.isArray(info) ? info.toString() : info),
            React.createElement("div", { className: "search-control-popup-seperator" }),
            React.createElement("div", null, `latitude: ${latLng.lat}`),
            React.createElement("div", null, `longitude: ${latLng.lng}`)));
        this.goToLatLng(latLng, popUpStructure);
    }
    removeMarkerHandler() {
        this.setState({ search: false });
    }
    goToLatLng(latLng, info) {
        this.setState({ search: latLng, info: info }, () => {
            this.flyTo();
        });
    }
    flyTo() {
        if (this.state.search) {
            switch (this.props.mapStateModifier) {
                case "flyTo":
                    this.map && this.map.flyTo(this.state.search, this.props.zoom, this.props.zoomPanOptions);
                    break;
                case "setView":
                    this.map && this.map.setView(this.state.search, this.props.zoom, this.props.zoomPanOptions);
                    break;
                default:
                    typeof this.props.mapStateModifier === "function" && this.props.mapStateModifier(this.state.search);
            }
        }
    }
    componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        ReactDOM.render(React.createElement(SearchControl, Object.assign({ className: this.props.className, provider: this.props.provider, customProvider: this.props.customProvider, providerOptions: this.props.providerOptions, openSearchOnLoad: this.props.openSearchOnLoad, closeResultsOnClick: this.props.closeResultsOnClick, inputPlaceholder: this.props.inputPlaceholder, search: this.props.search, map: this.map, handler: this.handler, removeMarker: this.handler }, (this.props.tabIndex !== undefined ? { tabIndex: this.props.tabIndex } : {}))), this.div);
    }
    componentDidUpdate() {
        this.markerRef.current && this.markerRef.current.leafletElement.openPopup();
    }
    defaultPopUp() {
        return (React.createElement(Popup, null,
            React.createElement("span", null, this.state.info)));
    }
    render() {
        return this.SearchInfo && this.state.search && this.props.showMarker ? (React.createElement(Marker, { ref: this.markerRef, icon: this.props.markerIcon || this.markerIcon, key: `marker-search-${this.state.search.toString()}`, position: this.state.search }, this.props.showPopup && (this.props.popUp ? this.props.popUp(this.SearchInfo) : this.defaultPopUp()))) : null;
    }
}
// static propTypes = {
//     position: PropTypes.string.isRequired,
//     providerKey: PropTypes.string,
//     inputPlaceholder: PropTypes.string,
//     showMarker: PropTypes.bool,
//     showPopup: PropTypes.bool,
//     popUp: PropTypes.func,
//     zoom: PropTypes.number,
//     search: PropTypes.arrayOf(PropTypes.number),
//     closeResultsOnClick: PropTypes.bool,
//     openSearchOnLoad: PropTypes.bool,
//     searchBounds: PropTypes.array,
//     provider: PropTypes.string,
//     providerOptions: PropTypes.object,
//     zoomPanOptions: PropTypes.object,
//     mapStateModifier: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
//     customProvider: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object])
// };
ReactLeafletSearch.defaultProps = {
    inputPlaceholder: "Search Lat,Lng",
    showMarker: true,
    showPopup: true,
    zoom: 10,
    closeResultsOnClick: false,
    openSearchOnLoad: false,
    search: undefined,
    provider: "OpenStreetMap",
    mapStateModifier: "flyTo",
    zoomPanOptions: {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.25,
        noMoveStart: false
    }
};
