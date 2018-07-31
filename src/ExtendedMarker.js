import { Marker } from 'react-leaflet'

export default class ExtendedMarker extends Marker {
    componentDidMount(...a) {
    super.componentDidMount(...a);
    setTimeout(() => { this.leafletElement.openPopup(); }, 1);
  }
}