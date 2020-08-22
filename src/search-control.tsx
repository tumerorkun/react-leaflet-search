import * as React from "react";
import Providers from "./Providers";
import { BingMap, OpenStreetMap } from "./Providers";
import PropTypes from "prop-types";
import { Map as LeafletMap, LatLng } from "leaflet";
import "../css/index.css";
import { SearchInput } from "./core/search-input";
import { SearchCloseButton } from "./core/search-close-button";
import { SearchIconButton } from "./core/search-icon-button";
import { SearchInfoList } from "./core/search-info-list";

export interface SearchControlProps {
    provider?: string;
    customProvider?: { search: (value: string) => Promise<any> };
    providerOptions?: {
        providerKey?: string | null;
        searchBounds?: [LatLng, LatLng];
        region?: string;
    };
    search?: LatLng;
    openSearchOnLoad?: boolean;
    handler?: (obj: {
        event: "add" | "remove";
        payload?: {
            latLng: LatLng;
            info: string;
            raw: any;
        };
    }) => any;
    closeResultsOnClick?: boolean;
    inputPlaceholder?: string;
    map?: LeafletMap;
    className?: string;
    tabIndex?: number;
}

interface SearchControlState {
    open: boolean | undefined;
    closeButton: boolean;
    showInfo: boolean;
}
type ItemData = { latitude: number; longitude: number; name: string };

class SearchControl extends React.Component<SearchControlProps, SearchControlState> {
    input: React.RefObject<HTMLInputElement>;
    div: React.RefObject<HTMLDivElement>;
    provider:
        | OpenStreetMap
        | BingMap
        | {
              search: (value: string) => Promise<any>;
          };
    responseCache: { [key: string]: any };
    SearchResponseInfo: JSX.Element | string | null;
    lastInfo: JSX.Element | string | null;
    lock!: boolean;
    inputEventHandler!: Function;
    inputValueSetter: Function;
    selectbox: React.RefObject<HTMLUListElement>;
    constructor(props: SearchControlProps) {
        super(props);
        this.state = {
            open: this.props.openSearchOnLoad,
            closeButton: false,
            showInfo: false,
        };
        this.SearchResponseInfo = "";
        this.responseCache = {};
        this.lastInfo = null;
        this.inputValueSetter = () => {};
        this.selectbox = React.createRef();
        this.div = React.createRef();
        this.input = React.createRef();
        // use custom provider if exists any
        if (this.props.customProvider) {
            this.provider = this.props.customProvider;
        } else if (this.props.provider && Object.keys(Providers).includes(this.props.provider)) {
            const Provider = Providers[this.props.provider];
            this.provider = new Provider(this.props.providerOptions);
        } else {
            throw new Error(
                `You set the provider prop to ${
                    this.props.provider
                } but that isn't recognised. You can choose from ${Object.keys(Providers).join(", ")}`,
            );
        }
    }

    static propTypes = {
        provider: PropTypes.string,
        providerKey: PropTypes.string,
        inputPlaceholder: PropTypes.string,
        coords: PropTypes.arrayOf(PropTypes.number),
        closeResultsOnClick: PropTypes.bool,
        openSearchOnLoad: PropTypes.bool,
        searchBounds: PropTypes.array,
        providerOptions: PropTypes.object,
    };

    static defaultProps: SearchControlProps = {
        inputPlaceholder: "Search Lat,Lng",
        closeResultsOnClick: false,
        openSearchOnLoad: false,
        search: undefined,
        provider: "OpenStreetMap",
    };

    setLock = (value: boolean) => {
        this.lock = value;
    };

    openSearch = () => {
        this.setState({ open: true }, () => {
            this.input.current?.focus();
        });
    };
    closeSearch = () => {
        this.setState({ open: this.props.openSearchOnLoad, closeButton: false, showInfo: false }, () => {
            this.inputValueSetter("");
            this.SearchResponseInfo = "";
            this.props.handler && this.props.handler({ event: "remove" });
        });
    };

    searchIconButtonOnClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.state.open ? this.closeSearch() : this.openSearch();
    };
    inputBlur = (e: React.SyntheticEvent) => {
        this.input.current?.value === "" && !this.lock && this.closeSearch();
    };
    inputClick = (e: React.SyntheticEvent) => {
        this.input.current?.focus();
        if (
            !this.input.current?.value.startsWith(":") &&
            this.lastInfo !== null &&
            this.lastInfo !== "" &&
            this.input.current?.value !== ""
        ) {
            this.SearchResponseInfo = this.lastInfo;
            this.lastInfo = null;
            this.setState({ showInfo: true });
        }
    };
    inputKeyUp = (e: React.KeyboardEvent) => {
        e.keyCode === 13 && this.beautifyValue(this.input.current!.value);
    };
    closeClick = (e: React.SyntheticEvent) => {
        this.closeSearch();
    };

    sendToAction = async (e: React.SyntheticEvent): Promise<any> => {
        if (!this.input.current!.value.startsWith(":")) {
            if (Object.prototype.hasOwnProperty.call(this.responseCache, this.input.current!.value)) {
                this.showInfo(this.responseCache[this.input.current!.value].info);
            } else {
                if (this.input.current!.value.length >= 3) {
                    this.showInfo("Searching...");
                    const searchValue = this.input.current!.value;
                    const response = await this.provider.search(searchValue);
                    if ((response as { error: string }).error) {
                        return false;
                    }
                    this.responseCache[searchValue] = response;
                    this.showInfo((response as { info: string }).info);
                }
            }
        }
    };
    syncInput = () => {
        !this.state.closeButton && this.setState({ closeButton: true });
        if (this.input.current?.value === "") {
            this.hideInfo();
            this.state.closeButton && this.setState({ closeButton: false });
        }
        if (!this.input.current?.value.startsWith(":")) {
        }
    };

    beautifyValue(value: string) {
        if (value.startsWith(":")) {
            const latLng = value
                .slice(1)
                .split(",")
                .filter((e) => !isNaN(Number(e)))
                .map((e) => Number(e ? e : 0));
            if (latLng.length <= 1) {
                this.showInfo("Please enter a valid lat, lng");
            } else {
                this.hideInfo();
                this.props.handler &&
                    this.props.handler({
                        event: "add",
                        payload: {
                            latLng: new LatLng(Number(latLng[0]), Number(latLng[1])),
                            info: latLng.join(","),
                            raw: latLng.join(","),
                        },
                    });
            }
        } else {
            if (this.input.current!.value.length < 3) {
                const response = 'Please enter a valid lat,lng starting with ":" or minimum 3 character to search';
                this.showInfo(response);
            }
        }
    }

    hideInfo() {
        this.lastInfo = this.SearchResponseInfo;
        this.SearchResponseInfo = "";
        this.setState({ showInfo: false });
    }
    showInfo(info: string | Array<ItemData>, activeIndex?: number) {
        // key changes when info changes so candidate number starts from zero
        this.SearchResponseInfo = (
            <SearchInfoList
                ref={this.selectbox}
                activeIndex={activeIndex}
                list={info}
                handler={this.listItemClick}
                tabIndex={this.props.tabIndex !== undefined ? this.props.tabIndex + 1 : 2}
            />
        );
        this.input.current?.value && this.setState({ showInfo: true });
    }

    listItemClick = (itemData: ItemData, totalInfo: Array<ItemData>, activeIndex: number) => {
        this.showInfo(totalInfo, activeIndex);
        this.props.handler &&
            this.props.handler({
                event: "add",
                payload: {
                    latLng: new LatLng(Number(itemData.latitude), Number(itemData.longitude)),
                    info: itemData.name,
                    raw: this.responseCache[this.input.current!.value].raw,
                },
            });
        if (this.props.closeResultsOnClick) {
            this.hideInfo();
        }
    };

    setMaxHeight = () => {
        const containerRect = this.props.map
            ? this.props.map.getContainer().getBoundingClientRect()
            : document.body.getBoundingClientRect();
        const divRect = this.input.current!.getBoundingClientRect();
        const maxHeight = `${Math.floor((containerRect.bottom - divRect.bottom - 10) * 0.6)}px`;
        this.selectbox.current && this.selectbox.current.style && (this.selectbox.current.style.maxHeight = maxHeight);
    };

    componentDidMount() {
        this.setMaxHeight();
        if (this.props.search && !isNaN(Number(this.props.search.lat)) && !isNaN(Number(this.props.search.lng))) {
            const inputValue = `:${this.props.search.lat},${this.props.search.lng}`;
            this.inputValueSetter(inputValue);
            this.openSearch();
            this.syncInput(); // to show close button
            this.props.handler &&
                this.props.handler({
                    event: "add",
                    payload: {
                        latLng: new LatLng(Number(this.props.search.lat), Number(this.props.search.lng)),
                        info: inputValue,
                        raw: this.props.search,
                    },
                });
        }
    }

    componentDidUpdate() {
        this.setMaxHeight();
        if (this.state.showInfo) {
            // this.selectbox.current && this.selectbox.current.focus();
        }
    }

    render() {
        return (
            <article className={`${this.props.className ? `${this.props.className} ` : ""}search-control-wrap`}>
                <section className={`search-control${this.state.open ? " search-control-active" : ""}`}>
                    <SearchIconButton
                        className="search-control-icon-button"
                        onClick={this.searchIconButtonOnClick}
                        onMouseEnter={() => this.setLock(true)}
                        onMouseLeave={() => this.setLock(false)}
                    />
                    <SearchInput
                        tabIndex={this.props.tabIndex !== undefined ? this.props.tabIndex : 1}
                        ref={this.input}
                        getInputValueSetter={(fn) => (this.inputValueSetter = fn)}
                        className="search-control-input"
                        placeholder={this.props.inputPlaceholder}
                        onClick={this.inputClick}
                        onMouseEnter={() => this.setLock(true)}
                        onMouseLeave={() => this.setLock(false)}
                        onChange={this.syncInput}
                        onChangeAsync={this.sendToAction}
                        onBlur={this.inputBlur}
                        onKeyUp={this.inputKeyUp}
                        onKeyPress={(e) => {
                            e.stopPropagation();
                            e.keyCode === 40 && e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                            // ArrowDown 40
                            if (e.keyCode === 40) {
                                e.preventDefault();
                                e.stopPropagation();
                                this.selectbox.current?.focus();
                            }
                            // ArrowUp 38
                        }}
                        onSubmit={(e) => e.preventDefault()}
                    />
                    <SearchCloseButton
                        className={this.state.closeButton ? " search-control-close-button-active" : ""}
                        onClick={this.closeClick}
                    />
                </section>
                <section
                    className={`search-control-info-wrapper${
                        this.state.showInfo ? "" : " search-control-info-wrapper-close"
                    }`}
                >
                    <section ref={this.div} className={`search-control-info`}>
                        {this.state.showInfo && this.SearchResponseInfo}
                    </section>
                </section>
            </article>
        );
    }
}

export { SearchControl };
