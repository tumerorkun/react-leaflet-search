import { Control, Layer, Icon } from 'leaflet'
import { LayerContainer, Map, MapControl, MapControlProps } from "react-leaflet";

export interface ReactLeafletSearchProps extends MapControlProps {
  zoom?: number;
  search?: [number, number];
  provider?: string;
  providerKey?: string;
  inputPlaceholder?: string;
  markerIcon?: Icon;
  showPopup?: boolean;
  showMarker?: boolean;
  closeResultsOnClick?: boolean;
  openSearchOnLoad?: boolean;
  providerOptions?: { [key: string]: any };
  searchBounds?: [[number, number], [number, number]];
  popUp?: (SearchInfo: string) => JSX.Element;
  leaflet?: {
    map?: Map;
    pane?: string;
    layerContainer?: LayerContainer;
    popupContainer?: Layer;
  };
  mapStateModifier?: ((arg:[number,number]) => any) | string;
  zoomPanOptions?: {
    animate?: boolean;
    duration?: number;
    easeLinearity?: number;
    noMoveStart?: boolean;
  };
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
