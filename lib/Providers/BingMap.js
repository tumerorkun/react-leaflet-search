"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BingMap = function () {
  function BingMap() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { providerKey: null, searchBounds: [] };

    _classCallCheck(this, BingMap);

    var providerKey = options.providerKey,
        searchBounds = options.searchBounds;

    this.key = providerKey;
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2'
    var boundsUrlComponent = "";
    if (searchBounds.length) {
      var _ref;

      this.bounds = (_ref = []).concat.apply(_ref, [[]].concat(searchBounds)).join(",");
      boundsUrlComponent = "&umv=" + this.bounds;
    }
    this.url = "https://dev.virtualearth.net/REST/v1/Locations?output=json" + boundsUrlComponent + "&key=" + this.key + "&q=";
  }

  BingMap.prototype.search = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
      var response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof this.key === 'undefined')) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", { error: 'BingMap requires an api key' });

            case 2:
              _context.next = 4;
              return fetch(this.url + query).then(function (res) {
                return res.json();
              });

            case 4:
              response = _context.sent;
              return _context.abrupt("return", this.formatResponse(response));

            case 6:
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

  BingMap.prototype.formatResponse = function formatResponse(response) {
    // console.log(response)
    var resources = response.resourceSets[0].resources;
    var count = response.resourceSets[0].estimatedTotal;
    // console.log(resources)
    var info = count > 0 ? resources.map(function (e) {
      return {
        bounds: e.bbox.map(function (bound) {
          return Number(bound);
        }),
        latitude: Number(e.point.coordinates[0]),
        longitude: Number(e.point.coordinates[1]),
        name: e.name
      };
    }) : 'Not Found';
    return {
      info: info,
      raw: response
    };
  };

  return BingMap;
}();

exports.BingMap = BingMap;