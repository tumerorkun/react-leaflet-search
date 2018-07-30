import './react-leaflet-search.css'
import { Control, DomUtil, DomEvent } from 'leaflet'
import React from 'react'
import { Marker, Popup, MapControl } from 'react-leaflet'

class ExtendedMarker extends Marker {
  componentDidMount(...a) {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount(...a);

    // Access the marker element and open the popup.
    this.leafletElement.openPopup();
  }
}

export default class ReactLeafletSearch extends MapControl {
    constructor(props){
        super(props)
        this.div = DomUtil.create(
            'div',
            'leaflet-search-control leaflet-bar-part leaflet-bar',
        );
        this.a = DomUtil.create(
            'a',
            'leaflet-search-control-a leaflet-search-icon',
            this.div,
        );
        this.input = DomUtil.create(
            'input',
            'leaflet-search-control-input leaflet-search-input',
            this.div,
        );
        this.close = DomUtil.create(
            'div',
            'leaflet-search-control-close',
            this.div,
        );
        this.info = DomUtil.create(
            'div',
            'leaflet-search-control-info close',
            this.div,
        );
        this.infoSpan = DomUtil.create(
            'span',
            'leaflet-search-control-info-span',
            this.info,
        );
        this.input.setAttribute('placeholder', 'Search Lat,Lng')
        this.close.innerHTML = 'x'
        this.initEvents()

        this.state = {
            search: this.props.search || false,
            info: false,
        };
        this.search = this.state.search
        this.input.value = this.search ? this.search.toString() : '';
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

    initEvents() {
        const aClick = () => {
            if (DomUtil.hasClass(this.div, 'leaflet-search-control-active')) {
                this.closeSearch()
            } else {
                this.openSearch()
            }
        }
        const aMouseDown = e => {
            DomEvent.stop(e)
        }
        const closeClick = () => {
            this.closeSearch()
        }
        const inputClick = e => {
            this.input.focus()
        }
        const inputMouseDown = e => {
            DomEvent.stop(e)
        }
        const inputInput = () => {
            if (this.input.value === '') {
                this.hideCloseButton()
            } else {
                this.showCloseButton()
            }
        }
        const inputBlur = e => {
            if (this.input.value === '') {
                DomEvent.stop(e)
                this.closeSearch()
            }
        }
        const inputKeyUp = e => {
            DomEvent.stop(e)
            if (e.keyCode === 13) {
                this.beautifyValueAndGo(this.input.value)
            }
        }

        DomEvent.on(this.a, 'click', aClick)
        DomEvent.on(this.close, 'click', closeClick)
        DomEvent.on(this.input, 'mousedown', inputMouseDown)
        DomEvent.on(this.input, 'click', inputClick)
        DomEvent.on(this.a, 'mousedown', aMouseDown)
        DomEvent.on(this.input, 'input', inputInput)
        DomEvent.on(this.input, 'blur', inputBlur)
        DomEvent.on(this.input, 'keyup', inputKeyUp)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.position.toString() === nextProps.position.toString()) {
            if (typeof nextProps.search !== 'undefined') {
                if (this.props.search.toString() !== nextProps.search.toString()) {
                    this.search = [...nextProps.search];
                    this.goToLatLng(this.search)
                }
            }
            if (this.state.search.toString() !== nextState.search.toString()) {
                this.search = [...nextState.search];
            }
            if (!nextState.search) {
                this.search = false
            }
        }
        return true;
    }

    componentDidMount() {
        super.componentDidMount()
        if (this.search) {
            this.openSearch();
            this.showCloseButton();
            this.input.value = this.search.toString()
        }
    }

    render() {
        const ele = this.search ? (
            <ExtendedMarker
                key={`marker-search-${this.search.toString()}`}
                position={[...this.search]}>
                <Popup>
                <span>{this.search.toString()}</span>
                </Popup>
            </ExtendedMarker>
        ) : null;

        return ele
    }

    beautifyValueAndGo(value) {
        const latLng = value
            .split(',')
            .filter(e => !isNaN(Number(e)))
            .map(e => Number(e ? e : 0))
        if (latLng.length === 1) {
            this.showInfo('Please enter a valid lat, lng')
        } else {
            this.hideInfo()
            this.goToLatLng(latLng)
        }
    }

    goToLatLng(latLng) {
        this.setState({search: latLng});
        this.flyTo();
        this.input.value = this.search ? this.search.toString() : '';
    }

    showInfo(info) {
        this.infoSpan.innerHTML = info
        DomUtil.removeClass(this.info, 'close')
    }

    hideInfo() {
        this.infoSpan.innerHTML = ''
        DomUtil.addClass(this.info, 'close')
    }

    openSearch() {
        DomUtil.addClass(this.div, 'leaflet-search-control-active')
        this.input.focus();
    }

    closeSearch() {
        DomUtil.removeClass(this.div, 'leaflet-search-control-active')
        DomUtil.removeClass(this.close, 'leaflet-search-close')
        this.input.value = ''
        this.search = false;
        this.setState({search: false});
    }

    showCloseButton() {
        DomUtil.addClass(this.close, 'leaflet-search-close')
    }

    hideCloseButton() {
        DomUtil.removeClass(this.close, 'leaflet-search-close')
    }

    flyTo() {
        this.context.map.flyTo([...this.state.search], this.props.zoom || 10)
    }

}
