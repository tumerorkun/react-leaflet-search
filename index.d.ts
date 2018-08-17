import { Control, Layer, Icon } from 'leaflet'
import { LayerContainer, Map, MapControl, MapControlProps, Popup } from "react-leaflet";

export interface ReactLeafletSearchProps extends MapControlProps {
  zoom?: number;
  search?: [number, number];
  provider?: string;
  providerKey?: string;
  inputPlaceholder?: string;
  markerIcon?: Icon;
  showPopup?: boolean;
  showMarker?: boolean;
  popUp?: (SearchInfo: string) => Popup;
  leaflet?: {
    map?: Map;
    pane?: string;
    layerContainer?: LayerContainer;
    popupContainer?: Layer;
  }
}

export interface ReactLeafletSearchState {
  search: boolean | [number, number];
  info: boolean | string;
}

export class ReactLeafletSearch extends MapControl<ReactLeafletSearchProps> {
  public div: HTMLElement;
  public map: Map;
  public markerIcon: Icon;
  public state: ReactLeafletSearchState;
  public props: ReactLeafletSearchProps;
  public createLeafletElement(props: ReactLeafletSearchProps): Control;
  public latLngHandler(latLng: [number, number], info: string): void;
  public removeMarkerHandler(): void;
  public goToLatLng(latLng: [number, number], info: string): void;
  public flyTo(): void;
}
