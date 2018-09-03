import React from 'react'
import Providers from './Providers'

const asyncInputEvent = (asyncHandler, syncHandler) => {
    let t;
    return e => {
        syncHandler && syncHandler(e);
        clearTimeout(t);
        t = setTimeout(() => { asyncHandler(e); }, 400);
    }
};

export default class InputBox extends React.Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.state = {
            open: this.props.openSearchOnLoad,
            closeButton: false,
            info: false
        };
        this.provider = null;
        this.responseCache = {};
        this.inputEventHandler = asyncInputEvent(this.sendToAction.bind(this), this.syncInput.bind(this));
        this.lastInfo = null;
    }

    inputMouseEnter(event) { this.lock = true; }
    inputMouseLeave(event) { this.lock = false; }
    aMouseEnter(event) { this.lock = true; }
    aMouseLeave(event) { this.lock = false; }
    aClick(event) { (this.state.open) ? this.closeSearch() : this.openSearch(); }
    inputBlur(event) { (this.input.value === '' && !this.lock) && this.closeSearch(); }
    inputClick(event) {
        this.input.focus();
        if (!this.input.value.startsWith(":") &&
            this.lastInfo !== null &&
            this.lastInfo !== '' &&
            this.input.value !== ''
        ) {
            this.info = this.lastInfo;
            this.lastInfo = null;
            this.setState({info: true});
        }
    }
    inputInput(event) { this.inputEventHandler(event); }
    inputKeyUp(event) { (event.keyCode === 13) && this.beautifyValue(this.input.value); }
    closeClick(event) { this.closeSearch(); }

    async sendToAction(event) {
        if (!this.input.value.startsWith(":")) {
            // console.log(this.input.value, 'ASYNC', this);
            if (Object.prototype.hasOwnProperty.call(this.responseCache, this.input.value)) {
                // console.log('from cache');
                this.showInfo(this.responseCache[this.input.value].info);
            } else {
                if (this.input.value.length >= 3) {
                    // console.log('fetching');
                    this.showInfo('Searching...')
                    const response = await this.provider.search(this.input.value);
                    if (response.error) { console.error(response.error); return false; }
                    // console.log(response);
                    this.responseCache[this.input.value] = response;
                    this.showInfo(response.info);
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
            // console.log(this.input.value);
        }
    }

    openSearch() {
        this.setState({ open: true }, () => {
            this.input.focus();
        });
    }
    closeSearch() {
        this.setState({ open: this.props.openSearchOnLoad, closeButton: false, info: false }, () => {
            this.input.value = '';
            this.info = '';
            this.props.removeMarker && this.props.removeMarker();
        });
    }

    beautifyValue(value) {
        // console.log(value);
        if (value.startsWith(":")) {
            const latLng = value
                .slice(1)
                .split(',')
                .filter(e => !isNaN(Number(e)))
                .map(e => Number(e ? e : 0));
            if (latLng.length <= 1) {
                this.showInfo('Please enter a valid lat, lng');
            } else {
                this.hideInfo();
                this.props.latLngHandler(latLng, latLng);
            }
        } else {
            if (this.input.value.length < 3) {
                const response = 'Please enter a valid lat,lng starting with ":" or minimum 3 character to search';
                this.showInfo(response);
            }
        }
    }

    hideInfo() {
        this.lastInfo = this.info;
        this.info = '';
        this.setState({info: false});
    }
    showInfo(info, activeIndex) {
        if (typeof info === 'string') {
            this.info = (<span className="leaflet-search-control-info-span">{info}</span>);
        }
        if (typeof info === 'object') {
            this.info = (
                <ul className="leaflet-search-control-info-ul">
                    {
                        info.map(
                            (e ,i) => (<li
                                key={`${e.name}-${i}`}
                                className={`leaflet-search-control-info-li${(typeof activeIndex !== 'undefined') ? ((activeIndex === i)?' active':''):''}`}
                                onClick={this.listItemClick.bind(this, e, info, i)} >
                                <p>{e.name}</p>
                            </li>)
                        )
                    }
                </ul>
            );
        }
        this.input.value && this.setState({info: true});
    }

    listItemClick(itemData, totalInfo, activeIndex, event) {
        this.showInfo(totalInfo, activeIndex);
        this.props.latLngHandler([Number(itemData.latitude), Number(itemData.longitude)], itemData.name);
        if (this.props.closeResultsOnClick) {
            this.hideInfo();
        }
    }

    setMaxHeight() {
        const containerRect = this.props.map.getContainer().getBoundingClientRect();
        const divRect = this.input.getBoundingClientRect();
        const maxHeight = `${Math.floor((containerRect.bottom - divRect.bottom - 10) * 0.95)}px`
        this.div.style.maxHeight = maxHeight;
    }

    componentDidMount() {
        this.setMaxHeight();
        if (this.props.provider && Object.keys(Providers).includes(this.props.provider)) {
            const Provider = Providers[this.props.provider];
            this.provider = new Provider(Object.assign({providerKey: this.props.providerKey, searchBounds: this.props.searchBounds}, this.props.providerOptions));
        } else {
            throw new Error(`You set the provider prop to ${this.props.provider} but that isn't recognised. You can choose from ${Object.keys(Providers).join(", ")}`)
        }
        if (this.props.search &&
            Array.isArray(this.props.search) &&
            !isNaN(Number(this.props.search[0])) &&
            !isNaN(Number(this.props.search[1]))
        ) {
            this.input.value = `:${this.props.search.toString()}`;
            this.openSearch();
            this.syncInput(); // to show close button
            this.props.latLngHandler([Number(this.props.search[0]), Number(this.props.search[1])], this.props.search.toString())
        }
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
                    placeholder={this.props.inputPlaceholder}
                    onClick={this.inputClick.bind(this)}
                    // onMouseDown={this.inputMouseDown.bind(this)}
                    onMouseEnter={this.inputMouseEnter.bind(this)}
                    onMouseLeave={this.inputMouseLeave.bind(this)}
                    onInput={this.inputInput.bind(this)}
                    onBlur={this.inputBlur.bind(this)}
                    onKeyUp={this.inputKeyUp.bind(this)}/>
                <div
                    className={`leaflet-search-control-close${this.state.closeButton?' leaflet-search-close':''}`}
                    onClick={this.closeClick.bind(this)}>x</div>
                <div
                    ref={ref => (this.div=ref)}
                    className={`leaflet-search-control-info${this.state.info ? '': ' close'}`}>
                    { (this.state.info) && this.info }
                </div>
            </div>
        )
    }
}
