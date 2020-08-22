var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import Providers from "./Providers";
import PropTypes from "prop-types";
import { LatLng } from "leaflet";
import "../css/index.css";
import { SearchInput } from "./core/search-input";
import { SearchCloseButton } from "./core/search-close-button";
import { SearchIconButton } from "./core/search-icon-button";
import { SearchInfoList } from "./core/search-info-list";
class SearchControl extends React.Component {
    constructor(props) {
        super(props);
        this.setLock = (value) => {
            this.lock = value;
        };
        this.openSearch = () => {
            this.setState({ open: true }, () => {
                var _a;
                (_a = this.input.current) === null || _a === void 0 ? void 0 : _a.focus();
            });
        };
        this.closeSearch = () => {
            this.setState({ open: this.props.openSearchOnLoad, closeButton: false, showInfo: false }, () => {
                this.inputValueSetter("");
                this.SearchResponseInfo = "";
                this.props.handler && this.props.handler({ event: "remove" });
            });
        };
        this.searchIconButtonOnClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.state.open ? this.closeSearch() : this.openSearch();
        };
        this.inputBlur = (e) => {
            var _a;
            ((_a = this.input.current) === null || _a === void 0 ? void 0 : _a.value) === "" && !this.lock && this.closeSearch();
        };
        this.inputClick = (e) => {
            var _a, _b, _c;
            (_a = this.input.current) === null || _a === void 0 ? void 0 : _a.focus();
            if (!((_b = this.input.current) === null || _b === void 0 ? void 0 : _b.value.startsWith(":")) &&
                this.lastInfo !== null &&
                this.lastInfo !== "" &&
                ((_c = this.input.current) === null || _c === void 0 ? void 0 : _c.value) !== "") {
                this.SearchResponseInfo = this.lastInfo;
                this.lastInfo = null;
                this.setState({ showInfo: true });
            }
        };
        this.inputKeyUp = (e) => {
            e.keyCode === 13 && this.beautifyValue(this.input.current.value);
        };
        this.closeClick = (e) => {
            this.closeSearch();
        };
        this.sendToAction = (e) => __awaiter(this, void 0, void 0, function* () {
            if (!this.input.current.value.startsWith(":")) {
                if (Object.prototype.hasOwnProperty.call(this.responseCache, this.input.current.value)) {
                    this.showInfo(this.responseCache[this.input.current.value].info);
                }
                else {
                    if (this.input.current.value.length >= 3) {
                        this.showInfo("Searching...");
                        const searchValue = this.input.current.value;
                        const response = yield this.provider.search(searchValue);
                        if (response.error) {
                            return false;
                        }
                        this.responseCache[searchValue] = response;
                        this.showInfo(response.info);
                    }
                }
            }
        });
        this.syncInput = () => {
            var _a, _b;
            !this.state.closeButton && this.setState({ closeButton: true });
            if (((_a = this.input.current) === null || _a === void 0 ? void 0 : _a.value) === "") {
                this.hideInfo();
                this.state.closeButton && this.setState({ closeButton: false });
            }
            if (!((_b = this.input.current) === null || _b === void 0 ? void 0 : _b.value.startsWith(":"))) {
            }
        };
        this.listItemClick = (itemData, totalInfo, activeIndex) => {
            this.showInfo(totalInfo, activeIndex);
            this.props.handler &&
                this.props.handler({
                    event: "add",
                    payload: {
                        latLng: new LatLng(Number(itemData.latitude), Number(itemData.longitude)),
                        info: itemData.name,
                        raw: this.responseCache[this.input.current.value].raw,
                    },
                });
            if (this.props.closeResultsOnClick) {
                this.hideInfo();
            }
        };
        this.setMaxHeight = () => {
            const containerRect = this.props.map
                ? this.props.map.getContainer().getBoundingClientRect()
                : document.body.getBoundingClientRect();
            const divRect = this.input.current.getBoundingClientRect();
            const maxHeight = `${Math.floor((containerRect.bottom - divRect.bottom - 10) * 0.6)}px`;
            this.selectbox.current && this.selectbox.current.style && (this.selectbox.current.style.maxHeight = maxHeight);
        };
        this.state = {
            open: this.props.openSearchOnLoad,
            closeButton: false,
            showInfo: false,
        };
        this.SearchResponseInfo = "";
        this.responseCache = {};
        this.lastInfo = null;
        this.inputValueSetter = () => { };
        this.selectbox = React.createRef();
        this.div = React.createRef();
        this.input = React.createRef();
        // use custom provider if exists any
        if (this.props.customProvider) {
            this.provider = this.props.customProvider;
        }
        else if (this.props.provider && Object.keys(Providers).includes(this.props.provider)) {
            const Provider = Providers[this.props.provider];
            this.provider = new Provider(this.props.providerOptions);
        }
        else {
            throw new Error(`You set the provider prop to ${this.props.provider} but that isn't recognised. You can choose from ${Object.keys(Providers).join(", ")}`);
        }
    }
    beautifyValue(value) {
        if (value.startsWith(":")) {
            const latLng = value
                .slice(1)
                .split(",")
                .filter((e) => !isNaN(Number(e)))
                .map((e) => Number(e ? e : 0));
            if (latLng.length <= 1) {
                this.showInfo("Please enter a valid lat, lng");
            }
            else {
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
        }
        else {
            if (this.input.current.value.length < 3) {
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
    showInfo(info, activeIndex) {
        var _a;
        // key changes when info changes so candidate number starts from zero
        this.SearchResponseInfo = (React.createElement(SearchInfoList, { ref: this.selectbox, activeIndex: activeIndex, list: info, handler: this.listItemClick, tabIndex: this.props.tabIndex !== undefined ? this.props.tabIndex + 1 : 2 }));
        ((_a = this.input.current) === null || _a === void 0 ? void 0 : _a.value) && this.setState({ showInfo: true });
    }
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
        return (React.createElement("article", { className: `${this.props.className ? `${this.props.className} ` : ""}search-control-wrap` },
            React.createElement("section", { className: `search-control${this.state.open ? " search-control-active" : ""}` },
                React.createElement(SearchIconButton, { className: "search-control-icon-button", onClick: this.searchIconButtonOnClick, onMouseEnter: () => this.setLock(true), onMouseLeave: () => this.setLock(false) }),
                React.createElement(SearchInput, { tabIndex: this.props.tabIndex !== undefined ? this.props.tabIndex : 1, ref: this.input, getInputValueSetter: (fn) => (this.inputValueSetter = fn), className: "search-control-input", placeholder: this.props.inputPlaceholder, onClick: this.inputClick, onMouseEnter: () => this.setLock(true), onMouseLeave: () => this.setLock(false), onChange: this.syncInput, onChangeAsync: this.sendToAction, onBlur: this.inputBlur, onKeyUp: this.inputKeyUp, onKeyPress: (e) => {
                        e.stopPropagation();
                        e.keyCode === 40 && e.preventDefault();
                    }, onKeyDown: (e) => {
                        var _a;
                        // ArrowDown 40
                        if (e.keyCode === 40) {
                            e.preventDefault();
                            e.stopPropagation();
                            (_a = this.selectbox.current) === null || _a === void 0 ? void 0 : _a.focus();
                        }
                        // ArrowUp 38
                    }, onSubmit: (e) => e.preventDefault() }),
                React.createElement(SearchCloseButton, { className: this.state.closeButton ? " search-control-close-button-active" : "", onClick: this.closeClick })),
            React.createElement("section", { className: `search-control-info-wrapper${this.state.showInfo ? "" : " search-control-info-wrapper-close"}` },
                React.createElement("section", { ref: this.div, className: `search-control-info` }, this.state.showInfo && this.SearchResponseInfo))));
    }
}
SearchControl.propTypes = {
    provider: PropTypes.string,
    providerKey: PropTypes.string,
    inputPlaceholder: PropTypes.string,
    coords: PropTypes.arrayOf(PropTypes.number),
    closeResultsOnClick: PropTypes.bool,
    openSearchOnLoad: PropTypes.bool,
    searchBounds: PropTypes.array,
    providerOptions: PropTypes.object,
};
SearchControl.defaultProps = {
    inputPlaceholder: "Search Lat,Lng",
    closeResultsOnClick: false,
    openSearchOnLoad: false,
    search: undefined,
    provider: "OpenStreetMap",
};
export { SearchControl };
