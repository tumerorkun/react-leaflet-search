import './react-leaflet-search.css'
import { Control, DomUtil, DomEvent } from 'leaflet'
import React from 'react'
import ReactDOM from 'react-dom'
import { Marker, Popup, MapControl } from 'react-leaflet'


const func = (f, inputSync) => {
    let t;
    return e => {
        inputSync && inputSync(e);
        clearTimeout(t);
        t = setTimeout(
            () => {
                f(e);
            },
            400
        );
    }
};

class InputBox extends React.Component {
    constructor(props) {
        super(props)
        this.input = null;
        this.state = {
            open: false,
            closeButton: false,
            info: false,
        }
        this.responseCache = {};
        this.inputEventHandler = func(this.sendToAction.bind(this),this.syncInput.bind(this));
    }

    inputMouseEnter(event) { this.lock = true; }
    inputMouseLeave(event) { this.lock = false; }
    aMouseEnter(event) { this.lock = true; }
    aMouseLeave(event) { this.lock = false; }
    aClick(event) { (this.state.open) ? this.closeSearch() : this.openSearch(); }
    inputBlur(event) {
        if (this.input.value === '' && !this.lock) {
            DomEvent.stop(event);
            this.closeSearch();
        }
    }
    inputClick(event) { this.input.focus() }
    inputInput(event) { this.inputEventHandler(event) }
    inputKeyUp(event) { (event.keyCode === 13) && this.beautifyValue(this.input.value) }
    closeClick(event) { this.closeSearch(); }

    async sendToAction(event) {
        if (!this.input.value.startsWith(":")) {
            console.log(this.input.value, 'ASYNC', this);
            if (Object.prototype.hasOwnProperty.call(this.responseCache, this.input.value)) {
                console.log('from cache')
                this.showInfo(this.responseCache[this.input.value]);
            } else {
                let response;
                if (this.input.value.length >= 3) {
                    console.log('fetching')
                    this.showInfo('Searching...')
                    response = await fetch(`https://nominatim.openstreetmap.org/search?q=${this.input.value}&format=json`)
                        .then(res => res.json());

                    console.log(response);
                    this.responseCache[this.input.value] = response;
                    this.showInfo(response);
                }
            }
        }
    }

    syncInput(event) {
        !this.state.closeButton && this.setState({ closeButton: true });
        if (this.input.value == '') {
            this.hideInfo();
            this.state.closeButton && this.setState({ closeButton: false });
        }
        if (!this.input.value.startsWith(":")) {
            console.log(this.input.value)
        }
    }

    openSearch() {
        this.setState({ open: true }, () => {
            this.input.focus();
        });
    }
    closeSearch() {
        this.setState({ open: false, closeButton: false, info: false }, () => {
            this.input.value = '';
            this.info = '';
            this.props.removeMarker && this.props.removeMarker()
        });
    }

    beautifyValue(value) {
        console.log(value)
        if (value.startsWith(":")) {
            const latLng = value
                .slice(1)
                .split(',')
                .filter(e => !isNaN(Number(e)))
                .map(e => Number(e ? e : 0))
            if (latLng.length <= 1) {
                this.showInfo('Please enter a valid lat, lng')
            } else {
                this.hideInfo()
                this.props.latLngHandler(latLng, latLng)
            }
        } else {
            if (this.input.value.length < 3) {
                const response = 'Please enter a valid lat,lng starting with ":" or minimum 3 character to search'
                this.showInfo(response)
            }
        }
    }

    hideInfo() {
        this.info = ''
        this.setState({info: false})
    }

    showInfo(info, activeItem) {
        if (typeof info === 'string') {
            this.info = (<span className="leaflet-search-control-info-span">{info}</span>)
        }
        if (Array.isArray(info)) {
            const ListWrapper = props => {
                const { children, ...prop } = props
                return <ul {...prop} className="leaflet-search-control-info-ul">{children}</ul>
            }
            const ListItem = props => {
                const { children, ...prop } = props
                return <li {...prop} >{children}</li>
            }

            this.info = (
                <ListWrapper>
                    {
                        info.map(e => (
                            <ListItem
                                key={e.place_id}
                                className={`leaflet-search-control-info-li${activeItem ? ((activeItem.place_id === e.place_id)?' active':''):''}`}
                                onClick={this.lisItemClick.bind(this, e, info)} >
                                <p>
                                    {e.display_name}
                                </p>
                            </ListItem>
                            )
                        )
                    }
                </ListWrapper>
            );
        }
        this.input.value && this.setState({info: true});
    }

    lisItemClick(itemData, totalInfo, event) {
        console.log(event.target.parentNode)
        this.showInfo(totalInfo, itemData)
        this.props.latLngHandler([Number(itemData.lat), Number(itemData.lon)], itemData.display_name)
    }

    render() {
        return (
            <div className={`leaflet-search-control leaflet-bar-part leaflet-bar${this.state.open && ' leaflet-search-control-active'}`}>
                <a
                    className={`leaflet-search-control-a leaflet-search-icon`}
                    onClick={this.aClick.bind(this)}
                    onMouseEnter={this.aMouseEnter.bind(this)}
                    onMouseLeave={this.aMouseLeave.bind(this)}
                    // onMouseDown={this.aMouseDown.bind(this)}
                ></a>
                <input
                    ref={ref => (this.input = ref)}
                    className="leaflet-search-control-input leaflet-search-input"
                    placeholder="Search Lat,Lng"
                    onClick={this.inputClick.bind(this)}
                    // onMouseDown={this.inputMouseDown.bind(this)}
                    onMouseEnter={this.inputMouseEnter.bind(this)}
                    onMouseLeave={this.inputMouseLeave.bind(this)}
                    onInput={this.inputInput.bind(this)}
                    onBlur={this.inputBlur.bind(this)}
                    onKeyUp={this.inputKeyUp.bind(this)}/>
                <div
                    className = {
                        `leaflet-search-control-close${this.state.closeButton?' leaflet-search-close':''}`
                    }
                    onClick={this.closeClick.bind(this)}>x</div>
                <div
                    className={`leaflet-search-control-info${this.state.info ? '': ' close'}`}>
                    {
                        (this.state.info) && this.info
                    }
                </div>
            </div>
        )
    }
}

class ExtendedMarker extends Marker {
    componentDidMount(...a) {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount(...a);

    // Access the marker element and open the popup.
    setTimeout(() => {
        this.leafletElement.openPopup();
    }, 1)
  }
}

export default class ReactLeafletSearch extends MapControl {
    constructor(props){
        super(props)
        this.div = DomUtil.create(
            'div',
            'wrap',
        );
        this.state = {
            search: this.props.search || false,
            info: false,
        };
        this.search = this.state.search
    }

    createLeafletElement(props) {
        const ReactLeafletSearch = Control.extend({
            onAdd: (map) => {
                return this.div
            },
            onRemove: (map) =>  {
                // this.closeSearch()
            }
        })
        return new ReactLeafletSearch(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    latLngHandler(latLng, info) {
        this.goToLatLng(latLng, <div><p>{Array.isArray(info)?info.toString():info}</p><p>{`lat: ${latLng[0]}, lng: ${latLng[1]}`}</p></div>);
    }
    removeMarkerHandler() {
        this.search = false;
        this.setState({search: false});
    }

    componentDidMount() {
        super.componentDidMount()
        ReactDOM.render(<InputBox
            latLngHandler={this.latLngHandler.bind(this)}
            removeMarker={this.removeMarkerHandler.bind(this)} />, this.div)
    }

    render() {
        const ele = this.search ? (
            <ExtendedMarker
                key={`marker-search-${this.search.toString()}`}
                position={[...this.search]}>
                <Popup>
                    <span>{this.state.info}</span>
                </Popup>
            </ExtendedMarker>
        ) : null;

        return ele
    }

    goToLatLng(latLng, info) {
        this.search = latLng
        this.setState({search: latLng, info: info});
        this.flyTo();
    }

    flyTo() {
        this.context.map.flyTo([...this.search], this.props.zoom || 2)
    }

}
