import { Control, DomUtil, DomEvent, Icon, LatLng, Map, ZoomPanOptions } from "leaflet";
import React from "react";
// import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Popup, MapControl, Marker, LeafletContext, MapControlProps } from "react-leaflet";
import { SearchControl, SearchControlProps } from "./search-control";

type SearchInfo = {
    latLng: LatLng;
    info: string | Array<string>;
    raw: Record<string, unknown>;
};
export type ReactLeafletSearchProps = MapControlProps &
    SearchControlProps & {
        showMarker?: boolean;
        showPopup?: boolean;
        zoom: number;
        mapStateModifier?: "flyTo" | "setView" | ((l: LatLng) => void);
        zoomPanOptions?: ZoomPanOptions;
        customProvider?: { search: (value: string) => Promise<any> };
        markerIcon?: Icon;
        popUp?: (i: { latLng: LatLng; info: string | Array<string>; raw: Object }) => JSX.Element;
        children?: (info: SearchInfo) => JSX.Element | null;
        onChange?: (info: SearchInfo) => void;
    };

interface ReactLeafletSearchState {
    search: LatLng | false;
    info: any;
}

export default class ReactLeafletSearch extends MapControl<ReactLeafletSearchProps> {
    div: HTMLDivElement;
    map?: Map;
    SearchInfo: SearchInfo | null;
    state: ReactLeafletSearchState;
    markerRef: React.RefObject<Marker>;
    constructor(props: ReactLeafletSearchProps, context: LeafletContext) {
        super(props);
        this.div = DomUtil.create("div", "leaflet-search-wrap") as HTMLDivElement;
        DomEvent.disableClickPropagation(this.div);
        DomEvent.disableScrollPropagation(this.div);
        this.state = {
            search: false,
            info: false
        };
        this.SearchInfo = null; // searched lat,lng or response from provider
        this.map = context.map || props.leaflet?.map;
        this.markerRef = React.createRef();
    }

    createLeafletElement(props: ReactLeafletSearchProps) {
        const ReactLeafletSearchControl = Control.extend({
            onAdd: (map: Map) => this.div,
            onRemove: (map: Map) => {}
        });
        return new ReactLeafletSearchControl(props);
    }

    handler = ({ event, payload }: { event: "add" | "remove"; payload?: SearchInfo }) => {
        if (event === "add" && payload) {
            this.props.onChange?.(payload);
            this.latLngHandler(payload.latLng, payload.info, payload.raw);
        } else {
            this.setState({ search: false });
        }
    };

    latLngHandler(latLng: LatLng, info: string | Array<string>, raw: Record<string, unknown>) {
        this.SearchInfo = { info, latLng, raw };
        const popUpStructure = (
            <div>
                <p>{Array.isArray(info) ? info.toString() : info}</p>
                <div className="search-control-popup-seperator"></div>
                <div>{`latitude: ${latLng.lat}`}</div>
                <div>{`longitude: ${latLng.lng}`}</div>
            </div>
        );
        this.goToLatLng(latLng, popUpStructure);
    }

    goToLatLng(latLng: LatLng, info: JSX.Element) {
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
        ReactDOM.render(
            <SearchControl
                className={this.props.className}
                provider={this.props.provider}
                customProvider={this.props.customProvider}
                providerOptions={this.props.providerOptions}
                openSearchOnLoad={this.props.openSearchOnLoad}
                closeResultsOnClick={this.props.closeResultsOnClick}
                inputPlaceholder={this.props.inputPlaceholder}
                search={this.props.search}
                map={this.map}
                handler={this.handler}
                {...(this.props.tabIndex !== undefined ? { tabIndex: this.props.tabIndex } : {})}
            />,
            this.div
        );
    }

    componentDidUpdate() {
        this.markerRef.current && this.markerRef.current.leafletElement.openPopup();
    }

    defaultPopUp() {
        return (
            <Popup>
                <span>{this.state.info}</span>
            </Popup>
        );
    }

    render() {
        return this.SearchInfo && this.state.search ? (
            this.props.children ? (
                this.props.children(this.SearchInfo)
            ) : this.props.showMarker ? (
                <Marker
                    ref={this.markerRef}
                    key={`marker-search-${this.state.search.toString()}`}
                    position={this.state.search}
                    {...(this.props.markerIcon ? { icon: this.props.markerIcon } : {})}
                >
                    {this.props.showPopup && (this.props.popUp ? this.props.popUp(this.SearchInfo) : this.defaultPopUp())}
                </Marker>
            ) : null
        ) : null;
    }

    // static propTypes = {
    //     position: PropTypes.oneOf(["topleft", "topright", "bottomleft", "bottomright"]).isRequired,
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
    //     customProvider: PropTypes.oneOfType([PropTypes.object]),
    // };
    static defaultProps: ReactLeafletSearchProps = {
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
}
