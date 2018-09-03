'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Providers = require('./Providers');

var _Providers2 = _interopRequireDefault(_Providers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var asyncInputEvent = function asyncInputEvent(asyncHandler, syncHandler) {
    var t = void 0;
    return function (e) {
        syncHandler && syncHandler(e);
        clearTimeout(t);
        t = setTimeout(function () {
            asyncHandler(e);
        }, 400);
    };
};

var InputBox = function (_React$Component) {
    _inherits(InputBox, _React$Component);

    function InputBox(props) {
        _classCallCheck(this, InputBox);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.input = null;
        _this.state = {
            open: _this.props.openSearchOnLoad,
            closeButton: false,
            info: false
        };
        _this.provider = null;
        _this.responseCache = {};
        _this.inputEventHandler = asyncInputEvent(_this.sendToAction.bind(_this), _this.syncInput.bind(_this));
        _this.lastInfo = null;
        return _this;
    }

    InputBox.prototype.inputMouseEnter = function inputMouseEnter(event) {
        this.lock = true;
    };

    InputBox.prototype.inputMouseLeave = function inputMouseLeave(event) {
        this.lock = false;
    };

    InputBox.prototype.aMouseEnter = function aMouseEnter(event) {
        this.lock = true;
    };

    InputBox.prototype.aMouseLeave = function aMouseLeave(event) {
        this.lock = false;
    };

    InputBox.prototype.aClick = function aClick(event) {
        this.state.open ? this.closeSearch() : this.openSearch();
    };

    InputBox.prototype.inputBlur = function inputBlur(event) {
        this.input.value === '' && !this.lock && this.closeSearch();
    };

    InputBox.prototype.inputClick = function inputClick(event) {
        this.input.focus();
        if (!this.input.value.startsWith(":") && this.lastInfo !== null && this.lastInfo !== '' && this.input.value !== '') {
            this.info = this.lastInfo;
            this.lastInfo = null;
            this.setState({ info: true });
        }
    };

    InputBox.prototype.inputInput = function inputInput(event) {
        this.inputEventHandler(event);
    };

    InputBox.prototype.inputKeyUp = function inputKeyUp(event) {
        event.keyCode === 13 && this.beautifyValue(this.input.value);
    };

    InputBox.prototype.closeClick = function closeClick(event) {
        this.closeSearch();
    };

    InputBox.prototype.sendToAction = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
            var response;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (this.input.value.startsWith(":")) {
                                _context.next = 15;
                                break;
                            }

                            if (!Object.prototype.hasOwnProperty.call(this.responseCache, this.input.value)) {
                                _context.next = 5;
                                break;
                            }

                            // console.log('from cache');
                            this.showInfo(this.responseCache[this.input.value].info);
                            _context.next = 15;
                            break;

                        case 5:
                            if (!(this.input.value.length >= 3)) {
                                _context.next = 15;
                                break;
                            }

                            // console.log('fetching');
                            this.showInfo('Searching...');
                            _context.next = 9;
                            return this.provider.search(this.input.value);

                        case 9:
                            response = _context.sent;

                            if (!response.error) {
                                _context.next = 13;
                                break;
                            }

                            console.error(response.error);return _context.abrupt('return', false);

                        case 13:
                            // console.log(response);
                            this.responseCache[this.input.value] = response;
                            this.showInfo(response.info);

                        case 15:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function sendToAction(_x) {
            return _ref.apply(this, arguments);
        }

        return sendToAction;
    }();

    InputBox.prototype.syncInput = function syncInput(event) {
        !this.state.closeButton && this.setState({ closeButton: true });
        if (this.input.value == '') {
            this.hideInfo();
            this.state.closeButton && this.setState({ closeButton: false });
        }
        if (!this.input.value.startsWith(":")) {
            // console.log(this.input.value);
        }
    };

    InputBox.prototype.openSearch = function openSearch() {
        var _this2 = this;

        this.setState({ open: true }, function () {
            _this2.input.focus();
        });
    };

    InputBox.prototype.closeSearch = function closeSearch() {
        var _this3 = this;

        this.setState({ open: this.props.openSearchOnLoad, closeButton: false, info: false }, function () {
            _this3.input.value = '';
            _this3.info = '';
            _this3.props.removeMarker && _this3.props.removeMarker();
        });
    };

    InputBox.prototype.beautifyValue = function beautifyValue(value) {
        // console.log(value);
        if (value.startsWith(":")) {
            var latLng = value.slice(1).split(',').filter(function (e) {
                return !isNaN(Number(e));
            }).map(function (e) {
                return Number(e ? e : 0);
            });
            if (latLng.length <= 1) {
                this.showInfo('Please enter a valid lat, lng');
            } else {
                this.hideInfo();
                this.props.latLngHandler(latLng, latLng);
            }
        } else {
            if (this.input.value.length < 3) {
                var response = 'Please enter a valid lat,lng starting with ":" or minimum 3 character to search';
                this.showInfo(response);
            }
        }
    };

    InputBox.prototype.hideInfo = function hideInfo() {
        this.lastInfo = this.info;
        this.info = '';
        this.setState({ info: false });
    };

    InputBox.prototype.showInfo = function showInfo(info, activeIndex) {
        var _this4 = this;

        if (typeof info === 'string') {
            this.info = _react2.default.createElement(
                'span',
                { className: 'leaflet-search-control-info-span' },
                info
            );
        }
        if ((typeof info === 'undefined' ? 'undefined' : _typeof(info)) === 'object') {
            this.info = _react2.default.createElement(
                'ul',
                { className: 'leaflet-search-control-info-ul' },
                info.map(function (e, i) {
                    return _react2.default.createElement(
                        'li',
                        {
                            key: e.name + '-' + i,
                            className: 'leaflet-search-control-info-li' + (typeof activeIndex !== 'undefined' ? activeIndex === i ? ' active' : '' : ''),
                            onClick: _this4.listItemClick.bind(_this4, e, info, i) },
                        _react2.default.createElement(
                            'p',
                            null,
                            e.name
                        )
                    );
                })
            );
        }
        this.input.value && this.setState({ info: true });
    };

    InputBox.prototype.listItemClick = function listItemClick(itemData, totalInfo, activeIndex, event) {
        this.showInfo(totalInfo, activeIndex);
        this.props.latLngHandler([Number(itemData.latitude), Number(itemData.longitude)], itemData.name);
        if (this.props.closeResultsOnClick) {
            this.hideInfo();
        }
    };

    InputBox.prototype.setMaxHeight = function setMaxHeight() {
        var containerRect = this.props.map.getContainer().getBoundingClientRect();
        var divRect = this.input.getBoundingClientRect();
        var maxHeight = Math.floor((containerRect.bottom - divRect.bottom - 10) * 0.95) + 'px';
        this.div.style.maxHeight = maxHeight;
    };

    InputBox.prototype.componentDidMount = function componentDidMount() {
        this.setMaxHeight();
        if (this.props.provider && Object.keys(_Providers2.default).includes(this.props.provider)) {
            var Provider = _Providers2.default[this.props.provider];
            this.provider = new Provider(Object.assign({ providerKey: this.props.providerKey, searchBounds: this.props.searchBounds }, this.props.providerOptions));
        } else {
            throw new Error('You set the provider prop to ' + this.props.provider + ' but that isn\'t recognised. You can choose from ' + Object.keys(_Providers2.default).join(", "));
        }
        if (this.props.search && Array.isArray(this.props.search) && !isNaN(Number(this.props.search[0])) && !isNaN(Number(this.props.search[1]))) {
            this.input.value = ':' + this.props.search.toString();
            this.openSearch();
            this.syncInput(); // to show close button
            this.props.latLngHandler([Number(this.props.search[0]), Number(this.props.search[1])], this.props.search.toString());
        }
    };

    InputBox.prototype.render = function render() {
        var _this5 = this;

        return _react2.default.createElement(
            'div',
            { className: 'leaflet-search-control leaflet-bar-part leaflet-bar' + (this.state.open && ' leaflet-search-control-active') },
            _react2.default.createElement('a', {
                className: 'leaflet-search-control-a leaflet-search-icon',
                onClick: this.aClick.bind(this),
                onMouseEnter: this.aMouseEnter.bind(this),
                onMouseLeave: this.aMouseLeave.bind(this)
                // onMouseDown={this.aMouseDown.bind(this)}
            }),
            _react2.default.createElement('input', {
                ref: function ref(_ref2) {
                    return _this5.input = _ref2;
                },
                className: 'leaflet-search-control-input leaflet-search-input',
                placeholder: this.props.inputPlaceholder,
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
                    className: 'leaflet-search-control-close' + (this.state.closeButton ? ' leaflet-search-close' : ''),
                    onClick: this.closeClick.bind(this) },
                'x'
            ),
            _react2.default.createElement(
                'div',
                {
                    ref: function ref(_ref3) {
                        return _this5.div = _ref3;
                    },
                    className: 'leaflet-search-control-info' + (this.state.info ? '' : ' close') },
                this.state.info && this.info
            )
        );
    };

    return InputBox;
}(_react2.default.Component);

exports.default = InputBox;