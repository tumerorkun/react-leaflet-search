import './css/react-leaflet-search.css'
import { Control, DomUtil, DomEvent } from 'leaflet'
import React from 'react'
import { Marker, Popup, MapControl } from 'react-leaflet'

class ExtendedMarker extends Marker {
  componentDidMount() {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount();

    // Access the marker element and open the popup.
    this.leafletElement.openPopup();
  }
}

export default class ReactLeafletSearch extends MapControl {
    constructor(props){
        super(props)
        this.state = {
            search: false,
            searchOpen: false,
            closeButtonShow: false,
            info: false,
        };
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
        )
        this.close = DomUtil.create(
            'div',
            'leaflet-search-control-close',
            this.div,
        )
        this.info = DomUtil.create(
            'div',
            'leaflet-search-control-info close',
            this.div,
        )
        this.infoSpan = DomUtil.create(
            'span',
            'leaflet-search-control-info-span',
            this.info,
        )
        
    }
  
  createLeafletElement(props) {
    const SearchLatLngControl = Control.extend({
      onAdd: () => {
        this.input.setAttribute('placeholder', 'Search Lat,Lng')
        this.input.value = ''
        this.close.innerHTML = 'x'
        this.initEvents()
        this.infoSpan.innerHTML = 'Lorem ipsum dolor sit amet'
        return this.div
      },
    })
    return new SearchLatLngControl(props)
  }

  openSearch() {
    DomUtil.addClass(this.div, 'leaflet-search-control-active')
    this.input.focus()
    this.setState({
      searchOpen: true,
    })
  }

  closeSearch() {
    DomUtil.removeClass(this.div, 'leaflet-search-control-active')
    DomUtil.removeClass(this.close, 'leaflet-search-close')
    this.input.value = ''
    this.setState({
      searchOpen: false,
      search: false,
    })
  }

  showCloseButton() {
    DomUtil.addClass(this.close, 'leaflet-search-close')
    this.setState({
      closeButtonShow: true,
    })
  }

  hideCloseButton() {
    DomUtil.removeClass(this.close, 'leaflet-search-close')
    this.setState({
      closeButtonShow: false,
    })
  }

  initEvents() {
    DomEvent.on(this.a, 'click', () => {
      if (this.state.searchOpen) {
        this.closeSearch()
      } else {
        this.openSearch()
      }
    })
    DomEvent.on(this.close, 'click', () => {
      this.closeSearch()
    })
    DomEvent.on(this.input, 'mousedown', e => {
      DomEvent.stop(e)
    })
    DomEvent.on(this.input, 'click', e => {
      this.input.focus()
    })
    DomEvent.on(this.a, 'mousedown', e => {
      DomEvent.stop(e)
    })
    DomEvent.on(this.input, 'input', () => {
      if (this.input.value === '') {
        this.hideCloseButton()
      } else {
        this.showCloseButton()
      }
    })
    DomEvent.on(this.input, 'blur', e => {
      if (this.input.value === '') {
        DomEvent.stop(e)
        this.closeSearch()
      }
    })
    DomEvent.on(this.input, 'keyup', e => {
      DomEvent.stop(e)
      if (e.keyCode === 13) {
        this.beautifyValueAndGo(this.input.value)
      }
    })
  }

  render() {
    const ele = this.state.search ? (
      <ExtendedMarker
        key={`marker-search-${this.state.search.toString()}`}
        position={this.state.search}>
        <Popup>
          <span>{this.state.search.toString()}</span>
        </Popup>
      </ExtendedMarker>
    ) : null

    if (ele) {
      this.context.map.flyTo(this.state.search, 15)
    }
    return ele
  }

  beautifyValueAndGo(value) {
    const latLng = value
      .split(',')
      .filter(e => !isNaN(Number(e)))
      .map(e => (e ? e : 0))
    if (latLng.length === 1) {
      this.showInfo('Please enter a valid lat,lng')
    } else {
      this.hideInfo()
      this.goToLatLng(latLng)
    }
  }

  goToLatLng(latLng) {
    this.setState({ search: latLng })
    this.context.map.flyTo(latLng, 15)
  }

  showInfo(info) {
    this.setState({ info: true })
    this.infoSpan.innerHTML = info
    DomUtil.removeClass(this.info, 'close')
  }

  hideInfo() {
    this.setState({
      info: false
    })
    this.infoSpan.innerHTML = ''
    DomUtil.addClass(this.info, 'close')
  }
}
