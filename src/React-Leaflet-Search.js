import './react-leaflet-search.css';
import { Control, DomUtil, icon } from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import { Popup, MapControl, Marker } from 'react-leaflet';
import InputBox from './InputBox';

export default class ReactLeafletSearch extends MapControl {
    constructor(props, context){
        super(props);
        this.div = DomUtil.create('div', 'wrap');
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
        })
        this.map = context.map || props.leaflet.map;
    }

    createLeafletElement(props) {
        const ReactLeafletSearch = Control.extend({
            onAdd: (map) => this.div,
            onRemove: (map) =>  {}
        })
        return new ReactLeafletSearch(props);
    }

    latLngHandler(latLng, info) {
        const popUpStructure = (
            <div>
                <p>{ Array.isArray(info) ? info.toString() : info }</p>
                <div style={{"width":"100%","height":"1px","backgroundColor":"#eee"}}></div>
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
    flyTo() { this.map.flyTo([...this.state.search], this.props.zoom || 10); }

    componentDidMount() {
        super.componentDidMount();
        ReactDOM.render(<InputBox
            {...this.props}
            latLngHandler={this.latLngHandler.bind(this)}
            removeMarker={this.removeMarkerHandler.bind(this)} />, this.div);
    }

    componentDidUpdate() {
        this.markerRef.leafletElement || this.markerRef.leafletElement.openPopup();
    }

    render() {
        return this.state.search ? (
            <Marker
                ref={ref => (this.markerRef = ref)}
                icon={ this.props.markerIcon || this.markerIcon }
                key={`marker-search-${this.state.search.toString()}`}
                position={[...this.state.search]}>
                <Popup>
                    <span>{this.state.info}</span>
                </Popup>
            </Marker>
        ) : null;
    }
}
