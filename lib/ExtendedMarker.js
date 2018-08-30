'use strict';

exports.__esModule = true;

var _reactLeaflet = require('react-leaflet');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExtendedMarker = function (_Marker) {
    _inherits(ExtendedMarker, _Marker);

    function ExtendedMarker() {
        _classCallCheck(this, ExtendedMarker);

        return _possibleConstructorReturn(this, _Marker.apply(this, arguments));
    }

    ExtendedMarker.prototype.componentDidMount = function componentDidMount() {
        var _Marker$prototype$com,
            _this2 = this;

        for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
            a[_key] = arguments[_key];
        }

        (_Marker$prototype$com = _Marker.prototype.componentDidMount).call.apply(_Marker$prototype$com, [this].concat(a));
        setTimeout(function () {
            _this2.leafletElement.openPopup();
        }, 1);
    };

    return ExtendedMarker;
}(_reactLeaflet.Marker);

exports.default = ExtendedMarker;