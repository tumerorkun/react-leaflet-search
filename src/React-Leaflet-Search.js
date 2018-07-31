import './react-leaflet-search.css';
import { Control, DomUtil } from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import { Popup, MapControl } from 'react-leaflet';
import ExtendedMarker from './ExtendedMarker';
import InputBox from './InputBox';

export default class ReactLeafletSearch extends MapControl {
    constructor(props){
        super(props);
        this.div = DomUtil.create('div', 'wrap');
        this.state = {
            search: this.props.search || false,
            info: false,
        };
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
                <span>{ Array.isArray(info) ? info.toString() : info }</span>
                <div style={{"width":"100%","height":"1px","background-color":"#eee"}}></div>
                <span>{ `latitude: ${latLng[0]} - longitude: ${latLng[1]}` }</span>
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
    flyTo() { this.context.map.flyTo([...this.state.search], this.props.zoom || 2); }

    componentDidMount() {
        super.componentDidMount();
        ReactDOM.render(<InputBox
            latLngHandler={this.latLngHandler.bind(this)}
            removeMarker={this.removeMarkerHandler.bind(this)} />, this.div);
    }

    render() {
        return this.state.search ? (
            <ExtendedMarker
                key={`marker-search-${this.state.search.toString()}`}
                position={[...this.state.search]}>
                <Popup>
                    <span>{this.state.info}</span>
                </Popup>
            </ExtendedMarker>
        ) : null;
    }
}
