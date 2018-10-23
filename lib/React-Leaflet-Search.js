'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-polyfill');

require('./react-leaflet-search.css');

var _leaflet = require('leaflet');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactLeaflet = require('react-leaflet');

var _InputBox = require('./InputBox');

var _InputBox2 = _interopRequireDefault(_InputBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactLeafletSearch = function (_MapControl) {
    _inherits(ReactLeafletSearch, _MapControl);

    function ReactLeafletSearch(props, context) {
        _classCallCheck(this, ReactLeafletSearch);

        var _this = _possibleConstructorReturn(this, _MapControl.call(this, props));

        _this.div = _leaflet.DomUtil.create('div', 'leaflet-search-wrap');
        L.DomEvent.disableClickPropagation(_this.div);
        L.DomEvent.disableScrollPropagation(_this.div);
        _this.state = {
            search: false,
            info: false
        };
        _this.markerIcon = (0, _leaflet.icon)({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        _this.SearchInfo = null; // searched lat,lng or response from provider
        _this.map = context.map || props.leaflet.map;
        return _this;
    }

    ReactLeafletSearch.prototype.createLeafletElement = function createLeafletElement(props) {
        var _this2 = this;

        var ReactLeafletSearch = _leaflet.Control.extend({
            onAdd: function onAdd(map) {
                return _this2.div;
            },
            onRemove: function onRemove(map) {}
        });
        return new ReactLeafletSearch(props);
    };

    ReactLeafletSearch.prototype.latLngHandler = function latLngHandler(latLng, info) {
        this.SearchInfo = { info: info, latLng: latLng };
        var popUpStructure = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'p',
                null,
                Array.isArray(info) ? info.toString() : info
            ),
            _react2.default.createElement('div', { className: 'leaflet-search-popup' }),
            _react2.default.createElement(
                'div',
                null,
                'latitude: ' + latLng[0]
            ),
            _react2.default.createElement(
                'div',
                null,
                'longitude: ' + latLng[1]
            )
        );
        this.goToLatLng(latLng, popUpStructure);
    };

    ReactLeafletSearch.prototype.removeMarkerHandler = function removeMarkerHandler() {
        this.setState({ search: false });
    };

    ReactLeafletSearch.prototype.goToLatLng = function goToLatLng(latLng, info) {
        var _this3 = this;

        this.setState({ search: latLng, info: info }, function () {
            _this3.flyTo();
        });
    };

    ReactLeafletSearch.prototype.flyTo = function flyTo() {
        if (this.props.mapStateModifier === 'flyTo') {
            this.map.flyTo([].concat(this.state.search), this.props.zoom, this.props.zoomPanOptions);
        } else if (this.props.mapStateModifier === 'setView') {
            this.map.setView([].concat(this.state.search), this.props.zoom, this.props.zoomPanOptions);
        } else {
            typeof this.props.mapStateModifier === 'function' && this.props.mapStateModifier([].concat(this.state.search));
        }
    };

    ReactLeafletSearch.prototype.componentDidMount = function componentDidMount() {
        _MapControl.prototype.componentDidMount.call(this);
        _reactDom2.default.render(_react2.default.createElement(_InputBox2.default, _extends({}, this.props, {
            map: this.map,
            latLngHandler: this.latLngHandler.bind(this),
            removeMarker: this.removeMarkerHandler.bind(this) })), this.div);
    };

    ReactLeafletSearch.prototype.componentDidUpdate = function componentDidUpdate() {
        this.markerRef && this.markerRef.leafletElement.openPopup();
    };

    ReactLeafletSearch.prototype.defaultPopUp = function defaultPopUp() {
        return _react2.default.createElement(
            _reactLeaflet.Popup,
            null,
            _react2.default.createElement(
                'span',
                null,
                this.state.info
            )
        );
    };

    ReactLeafletSearch.prototype.render = function render() {
        var _this4 = this;

        this.markerRef = false;
        var _ = this;
        return this.state.search && this.props.showMarker ? _react2.default.createElement(
            _reactLeaflet.Marker,
            {
                ref: function ref(_ref) {
                    return _this4.markerRef = _ref;
                },
                icon: this.props.markerIcon || this.markerIcon,
                key: 'marker-search-' + this.state.search.toString(),
                position: [].concat(this.state.search) },
            this.props.showPopup && (this.props.popUp ? this.props.popUp(this.SearchInfo) : this.defaultPopUp())
        ) : null;
    };

    return ReactLeafletSearch;
}(_reactLeaflet.MapControl);

exports.default = ReactLeafletSearch;


ReactLeafletSearch.propTypes = {
    position: _propTypes2.default.string.isRequired,
    providerKey: _propTypes2.default.string,
    inputPlaceholder: _propTypes2.default.string,
    showMarker: _propTypes2.default.bool,
    showPopup: _propTypes2.default.bool,
    popUp: _propTypes2.default.func,
    zoom: _propTypes2.default.number,
    search: _propTypes2.default.arrayOf(_propTypes2.default.number),
    closeResultsOnClick: _propTypes2.default.bool,
    openSearchOnLoad: _propTypes2.default.bool,
    searchBounds: _propTypes2.default.array,
    provider: _propTypes2.default.string,
    providerOptions: _propTypes2.default.object,
    zoomPanOptions: _propTypes2.default.object,
    mapStateModifier: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

ReactLeafletSearch.defaultProps = {
    inputPlaceholder: "Search Lat,Lng",
    showMarker: true,
    showPopup: true,
    zoom: 10,
    search: [],
    closeResultsOnClick: false,
    openSearchOnLoad: false,
    searchBounds: [],
    provider: 'OpenStreetMap',
    providerOptions: {},
    mapStateModifier: 'flyTo',
    zoomPanOptions: {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.25,
        noMoveStart: false
    }
};