"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenStreetMap = function () {
  function OpenStreetMap() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { providerKey: null, searchBounds: [] };

    _classCallCheck(this, OpenStreetMap);

    var providerKey = options.providerKey,
        searchBounds = options.searchBounds;
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2' which is the opposite way around from lat/lng - it's lng/lat

    var boundsUrlComponent = "";
    var regionUrlComponent = "";
    if (searchBounds.length) {
      var _ref;

      var reversed = searchBounds.map(function (el) {
        return el.reverse();
      });
      this.bounds = (_ref = []).concat.apply(_ref, [[]].concat(reversed)).join(",");
      boundsUrlComponent = "&bounded=1&viewbox=" + this.bounds;
    }
    if ('region' in options) {
      regionUrlComponent = "&countrycodes=" + options.region;
    }
    this.url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1" + boundsUrlComponent + regionUrlComponent + "&q=";
  }

  OpenStreetMap.prototype.search = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
      var response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(this.url + query).then(function (res) {
                return res.json();
              });

            case 2:
              response = _context.sent;
              return _context.abrupt("return", this.formatResponse(response));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function search(_x2) {
      return _ref2.apply(this, arguments);
    }

    return search;
  }();

  OpenStreetMap.prototype.formatResponse = function formatResponse(response) {
    var resources = response;
    var count = response.length;
    var info = count > 0 ? resources.map(function (e) {
      return {
        bounds: e.boundingbox.map(function (bound) {
          return Number(bound);
        }),
        latitude: Number(e.lat),
        longitude: Number(e.lon),
        name: e.display_name
      };
    }) : 'Not Found';
    return {
      info: info,
      raw: response
    };
  };

  return OpenStreetMap;
}();

exports.OpenStreetMap = OpenStreetMap;