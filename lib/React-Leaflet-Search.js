'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('./react-leaflet-search.css');

var _leaflet = require('leaflet');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLeaflet = require('react-leaflet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExtendedMarker = function (_Marker) {
    _inherits(ExtendedMarker, _Marker);

    function ExtendedMarker() {
        _classCallCheck(this, ExtendedMarker);

        return _possibleConstructorReturn(this, (ExtendedMarker.__proto__ || Object.getPrototypeOf(ExtendedMarker)).apply(this, arguments));
    }

    _createClass(ExtendedMarker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _get2;

            for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
                a[_key] = arguments[_key];
            }

            // Call the Marker class componentDidMount (to make sure everything behaves as normal)
            (_get2 = _get(ExtendedMarker.prototype.__proto__ || Object.getPrototypeOf(ExtendedMarker.prototype), 'componentDidMount', this)).call.apply(_get2, [this].concat(a));

            // Access the marker element and open the popup.
            this.leafletElement.openPopup();
        }
    }]);

    return ExtendedMarker;
}(_reactLeaflet.Marker);

var ReactLeafletSearch = function (_MapControl) {
    _inherits(ReactLeafletSearch, _MapControl);

    function ReactLeafletSearch(props) {
        _classCallCheck(this, ReactLeafletSearch);

        var _this2 = _possibleConstructorReturn(this, (ReactLeafletSearch.__proto__ || Object.getPrototypeOf(ReactLeafletSearch)).call(this, props));

        _this2.div = _leaflet.DomUtil.create('div', 'leaflet-search-control leaflet-bar-part leaflet-bar');
        _this2.a = _leaflet.DomUtil.create('a', 'leaflet-search-control-a leaflet-search-icon', _this2.div);
        _this2.input = _leaflet.DomUtil.create('input', 'leaflet-search-control-input leaflet-search-input', _this2.div);
        _this2.close = _leaflet.DomUtil.create('div', 'leaflet-search-control-close', _this2.div);
        _this2.info = _leaflet.DomUtil.create('div', 'leaflet-search-control-info close', _this2.div);
        _this2.infoSpan = _leaflet.DomUtil.create('span', 'leaflet-search-control-info-span', _this2.info);
        _this2.input.setAttribute('placeholder', 'Search Lat,Lng');
        _this2.close.innerHTML = 'x';
        _this2.initEvents();

        _this2.state = {
            search: _this2.props.search || false,
            info: false
        };
        _this2.search = _this2.state.search;
        _this2.input.value = _this2.search ? _this2.search.toString() : '';
        return _this2;
    }

    _createClass(ReactLeafletSearch, [{
        key: 'createLeafletElement',
        value: function createLeafletElement(props) {
            var _this3 = this;

            var ReactLeafletSearch = _leaflet.Control.extend({
                onAdd: function onAdd(map) {
                    return _this3.div;
                },
                onRemove: function onRemove(map) {
                    // this.closeSearch()
                }
            });
            return new ReactLeafletSearch(props);
        }
    }, {
        key: 'initEvents',
        value: function initEvents() {
            var _this4 = this;

            var aClick = function aClick() {
                if (_leaflet.DomUtil.hasClass(_this4.div, 'leaflet-search-control-active')) {
                    _this4.closeSearch();
                } else {
                    _this4.openSearch();
                }
            };
            var aMouseDown = function aMouseDown(e) {
                _leaflet.DomEvent.stop(e);
            };
            var closeClick = function closeClick() {
                _this4.closeSearch();
            };
            var inputClick = function inputClick(e) {
                _this4.input.focus();
            };
            var inputMouseDown = function inputMouseDown(e) {
                _leaflet.DomEvent.stop(e);
            };
            var inputInput = function inputInput() {
                if (_this4.input.value === '') {
                    _this4.hideCloseButton();
                } else {
                    _this4.showCloseButton();
                }
            };
            var inputBlur = function inputBlur(e) {
                if (_this4.input.value === '') {
                    _leaflet.DomEvent.stop(e);
                    _this4.closeSearch();
                }
            };
            var inputKeyUp = function inputKeyUp(e) {
                _leaflet.DomEvent.stop(e);
                if (e.keyCode === 13) {
                    _this4.beautifyValueAndGo(_this4.input.value);
                }
            };

            _leaflet.DomEvent.on(this.a, 'click', aClick);
            _leaflet.DomEvent.on(this.close, 'click', closeClick);
            _leaflet.DomEvent.on(this.input, 'mousedown', inputMouseDown);
            _leaflet.DomEvent.on(this.input, 'click', inputClick);
            _leaflet.DomEvent.on(this.a, 'mousedown', aMouseDown);
            _leaflet.DomEvent.on(this.input, 'input', inputInput);
            _leaflet.DomEvent.on(this.input, 'blur', inputBlur);
            _leaflet.DomEvent.on(this.input, 'keyup', inputKeyUp);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.props.position.toString() === nextProps.position.toString()) {
                if (typeof nextProps.search !== 'undefined') {
                    if (this.props.search.toString() !== nextProps.search.toString()) {
                        this.search = [].concat(_toConsumableArray(nextProps.search));
                        this.goToLatLng(this.search);
                    }
                }
                if (this.state.search.toString() !== nextState.search.toString()) {
                    this.search = [].concat(_toConsumableArray(nextState.search));
                }
                if (!nextState.search) {
                    this.search = false;
                }
            }
            return true;
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            _get(ReactLeafletSearch.prototype.__proto__ || Object.getPrototypeOf(ReactLeafletSearch.prototype), 'componentDidMount', this).call(this);
            if (this.search) {
                this.openSearch();
                this.showCloseButton();
                this.input.value = this.search.toString();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var ele = this.search ? _react2.default.createElement(
                ExtendedMarker,
                {
                    key: 'marker-search-' + this.search.toString(),
                    position: [].concat(_toConsumableArray(this.search)) },
                _react2.default.createElement(
                    _reactLeaflet.Popup,
                    null,
                    _react2.default.createElement(
                        'span',
                        null,
                        this.search.toString()
                    )
                )
            ) : null;

            return ele;
        }
    }, {
        key: 'beautifyValueAndGo',
        value: function beautifyValueAndGo(value) {
            var latLng = value.split(',').filter(function (e) {
                return !isNaN(Number(e));
            }).map(function (e) {
                return Number(e ? e : 0);
            });
            if (latLng.length === 1) {
                this.showInfo('Please enter a valid lat, lng');
            } else {
                this.hideInfo();
                this.goToLatLng(latLng);
            }
        }
    }, {
        key: 'goToLatLng',
        value: function goToLatLng(latLng) {
            this.setState({ search: latLng });
            this.flyTo();
            this.input.value = this.search ? this.search.toString() : '';
        }
    }, {
        key: 'showInfo',
        value: function showInfo(info) {
            this.infoSpan.innerHTML = info;
            _leaflet.DomUtil.removeClass(this.info, 'close');
        }
    }, {
        key: 'hideInfo',
        value: function hideInfo() {
            this.infoSpan.innerHTML = '';
            _leaflet.DomUtil.addClass(this.info, 'close');
        }
    }, {
        key: 'openSearch',
        value: function openSearch() {
            _leaflet.DomUtil.addClass(this.div, 'leaflet-search-control-active');
            this.input.focus();
        }
    }, {
        key: 'closeSearch',
        value: function closeSearch() {
            _leaflet.DomUtil.removeClass(this.div, 'leaflet-search-control-active');
            _leaflet.DomUtil.removeClass(this.close, 'leaflet-search-close');
            this.input.value = '';
            this.search = false;
            this.setState({ search: false });
        }
    }, {
        key: 'showCloseButton',
        value: function showCloseButton() {
            _leaflet.DomUtil.addClass(this.close, 'leaflet-search-close');
        }
    }, {
        key: 'hideCloseButton',
        value: function hideCloseButton() {
            _leaflet.DomUtil.removeClass(this.close, 'leaflet-search-close');
        }
    }, {
        key: 'flyTo',
        value: function flyTo() {
            this.context.map.flyTo([].concat(_toConsumableArray(this.state.search)), this.props.zoom || 10);
        }
    }]);

    return ReactLeafletSearch;
}(_reactLeaflet.MapControl);

exports.default = ReactLeafletSearch;