'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Providers = require('./Providers');

var _Providers2 = _interopRequireDefault(_Providers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const asyncInputEvent = (asyncHandler, syncHandler) => {
    let t;
    return e => {
        syncHandler && syncHandler(e);
        clearTimeout(t);
        t = setTimeout(() => {
            asyncHandler(e);
        }, 400);
    };
};

class InputBox extends _react2.default.Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.state = {
            open: false,
            closeButton: false,
            info: false
        };
        this.provider = null;
        this.responseCache = {};
        this.inputEventHandler = asyncInputEvent(this.sendToAction.bind(this), this.syncInput.bind(this));
    }

    inputMouseEnter(event) {
        this.lock = true;
    }
    inputMouseLeave(event) {
        this.lock = false;
    }
    aMouseEnter(event) {
        this.lock = true;
    }
    aMouseLeave(event) {
        this.lock = false;
    }
    aClick(event) {
        this.state.open ? this.closeSearch() : this.openSearch();
    }
    inputBlur(event) {
        this.input.value === '' && !this.lock && this.closeSearch();
    }
    inputClick(event) {
        this.input.focus();
    }
    inputInput(event) {
        this.inputEventHandler(event);
    }
    inputKeyUp(event) {
        event.keyCode === 13 && this.beautifyValue(this.input.value);
    }
    closeClick(event) {
        this.closeSearch();
    }

    async sendToAction(event) {
        if (!this.input.value.startsWith(":")) {
            // console.log(this.input.value, 'ASYNC', this);
            if (Object.prototype.hasOwnProperty.call(this.responseCache, this.input.value)) {
                // console.log('from cache');
                this.showInfo(this.responseCache[this.input.value].info);
            } else {
                if (this.input.value.length >= 3) {
                    // console.log('fetching');
                    this.showInfo('Searching...');
                    const response = await this.provider.search(this.input.value);
                    if (response.error) {
                        console.error(response.error);return false;
                    }
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
        this.setState({ open: false, closeButton: false, info: false }, () => {
            this.input.value = '';
            this.info = '';
            this.props.removeMarker && this.props.removeMarker();
        });
    }

    beautifyValue(value) {
        // console.log(value);
        if (value.startsWith(":")) {
            const latLng = value.slice(1).split(',').filter(e => !isNaN(Number(e))).map(e => Number(e ? e : 0));
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
        this.info = '';
        this.setState({ info: false });
    }
    showInfo(info, activeIndex) {
        if (typeof info === 'string') {
            this.info = _react2.default.createElement(
                'span',
                { className: 'leaflet-search-control-info-span' },
                info
            );
        }
        if (typeof info === 'object') {
            this.info = _react2.default.createElement(
                'ul',
                { className: 'leaflet-search-control-info-ul' },
                info.map((e, i) => _react2.default.createElement(
                    'li',
                    {
                        key: `${e.name}-${i}`,
                        className: `leaflet-search-control-info-li${typeof activeIndex !== 'undefined' ? activeIndex === i ? ' active' : '' : ''}`,
                        onClick: this.lisItemClick.bind(this, e, info, i) },
                    _react2.default.createElement(
                        'p',
                        null,
                        e.name
                    )
                ))
            );
        }
        this.input.value && this.setState({ info: true });
    }

    lisItemClick(itemData, totalInfo, activeIndex, event) {
        this.showInfo(totalInfo, activeIndex);
        this.props.latLngHandler([Number(itemData.latitude), Number(itemData.longitude)], itemData.name);
    }

    componentDidMount() {
        if (this.props.provider && Object.keys(_Providers2.default).includes(this.props.provider)) {
            const Provider = _Providers2.default[this.props.provider];
            if (this.props.providerKey) {
                this.provider = new Provider(this.props.providerKey);
            } else {
                this.provider = new Provider();
            }
        } else {
            const Provider = _Providers2.default.OpenStreetMap;
            this.provider = new Provider();
        }
        // console.log(this.provider)
    }

    render() {
        return _react2.default.createElement(
            'div',
            { className: `leaflet-search-control leaflet-bar-part leaflet-bar${this.state.open && ' leaflet-search-control-active'}` },
            _react2.default.createElement('a', {
                className: `leaflet-search-control-a leaflet-search-icon`,
                onClick: this.aClick.bind(this),
                onMouseEnter: this.aMouseEnter.bind(this),
                onMouseLeave: this.aMouseLeave.bind(this)
                // onMouseDown={this.aMouseDown.bind(this)}
            }),
            _react2.default.createElement('input', {
                ref: ref => this.input = ref,
                className: 'leaflet-search-control-input leaflet-search-input',
                placeholder: 'Search Lat,Lng',
                onClick: this.inputClick.bind(this)
                // onMouseDown={this.inputMouseDown.bind(this)}
                , onMouseEnter: this.inputMouseEnter.bind(this),
                onMouseLeave: this.inputMouseLeave.bind(this),
                onInput: this.inputInput.bind(this),
                onBlur: this.inputBlur.bind(this),
                onKeyUp: this.inputKeyUp.bind(this) }),
            _react2.default.createElement(
                'div',
                {
                    className: `leaflet-search-control-close${this.state.closeButton ? ' leaflet-search-close' : ''}`,
                    onClick: this.closeClick.bind(this) },
                'x'
            ),
            _react2.default.createElement(
                'div',
                {
                    className: `leaflet-search-control-info${this.state.info ? '' : ' close'}` },
                this.state.info && this.info
            )
        );
    }
}
exports.default = InputBox;