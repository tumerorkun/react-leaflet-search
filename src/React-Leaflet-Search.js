import 'babel-polyfill'
import './react-leaflet-search.css';
import { Control, DomUtil, icon } from 'leaflet';
import React from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import { Popup, MapControl, Marker } from 'react-leaflet';
import InputBox from './InputBox';

export default class ReactLeafletSearch extends MapControl {
    constructor(props, context){
        super(props);
        this.div = DomUtil.create('div', 'leaflet-search-wrap');
        L.DomEvent.disableClickPropagation(this.div);
        L.DomEvent.disableScrollPropagation(this.div);
        this.state = {
            search: false,
            info: false,
        };
        this.markerIcon = icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        this.SearchInfo = null; // searched lat,lng or response from provider
        this.map = context.map || props.leaflet.map;
    }

    createLeafletElement(props) {
        const ReactLeafletSearch = Control.extend({
          onAdd: (map) => this.div,
          onRemove: (map) =>  {}
        });
        return new ReactLeafletSearch(props);
    }

    latLngHandler(latLng, info) {
        this.SearchInfo = {info, latLng};
        const popUpStructure = (
            <div>
                <p>{ Array.isArray(info) ? info.toString() : info }</p>
                <div className='leaflet-search-popup'></div>
                <div>{`latitude: ${latLng[0]}`}</div>
                <div>{`longitude: ${latLng[1]}`}</div>
            </div>
        )
        this.goToLatLng(latLng, popUpStructure);
    }

    removeMarkerHandler() { this.setState({search: false}); }

    goToLatLng(latLng, info) {
        this.setState({ search: latLng, info: info }, () => {
            this.flyTo();
        });
    }
    flyTo() {
        if (this.props.mapStateModifier === 'flyTo') {
            this.map.flyTo([...this.state.search], this.props.zoom, this.props.zoomPanOptions);
        } else if (this.props.mapStateModifier === 'setView') {
            this.map.setView([...this.state.search], this.props.zoom, this.props.zoomPanOptions);
        } else {
            (typeof this.props.mapStateModifier === 'function') && this.props.mapStateModifier([...this.state.search]);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        ReactDOM.render(<InputBox
            {...this.props}
            map={this.map}
            latLngHandler={this.latLngHandler.bind(this)}
            removeMarker={this.removeMarkerHandler.bind(this)} />, this.div);
    }

    componentDidUpdate() {
        this.markerRef && this.markerRef.leafletElement.openPopup();
    }

    defaultPopUp() {
      return(
        <Popup>
            <span>{this.state.info}</span>
        </Popup>
      );
    }

    render() {
        this.markerRef = false;
        const _ = this;
        return this.state.search && this.props.showMarker ? (
            <Marker
                ref={ref => (this.markerRef = ref)}
                icon={ this.props.markerIcon || this.markerIcon }
                key={`marker-search-${this.state.search.toString()}`}
                position={[...this.state.search]}>
                {
                  this.props.showPopup && (
                    this.props.popUp ? this.props.popUp(this.SearchInfo) : this.defaultPopUp()
                  )
                }
            </Marker>
        ) : null;
    }
}

ReactLeafletSearch.propTypes = {
    position: PropTypes.string.isRequired,
    providerKey: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    showMarker: PropTypes.bool,
    showPopup: PropTypes.bool,
    popUp: PropTypes.func,
    zoom: PropTypes.number,
    search: PropTypes.arrayOf(PropTypes.number),
    closeResultsOnClick: PropTypes.bool,
    openSearchOnLoad: PropTypes.bool,
    searchBounds: PropTypes.array,
    provider: PropTypes.string,
    providerOptions: PropTypes.object,
    zoomPanOptions: PropTypes.object,
    mapStateModifier: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
    ])
};

ReactLeafletSearch.defaultProps = {
    inputPlaceholder: "Search Lat,Lng",
    showMarker: true,
    showPopup: true,
    zoom: 10,
    search: [],
    closeResultsOnClick: false,
    openSearchOnLoad: false,
    searchBounds: [],
    provider: 'OpenStreetMap',
    providerOptions: {},
    mapStateModifier: 'flyTo',
    zoomPanOptions: {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.25,
        noMoveStart: false
    }
};
