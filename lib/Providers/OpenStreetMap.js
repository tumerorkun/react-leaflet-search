'use strict';

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class OpenStreetMap {
  constructor() {
    this.url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1&q=';
  }

  search(query) {
    var _this = this;

    return _asyncToGenerator(function* () {
      // console.log(this.url + query)
      const response = yield fetch(_this.url + query).then(function (res) {
        return res.json();
      });
      return _this.formatResponse(response);
    })();
  }

  formatResponse(response) {
    const resources = response;
    const count = response.length;
    const info = count > 0 ? resources.map(e => ({
      bounds: e.boundingbox.map(bound => Number(bound)),
      latitude: Number(e.lat),
      longitude: Number(e.lon),
      name: e.display_name
    })) : 'Not Found';
    return {
      info: info,
      raw: response
    };
  }

}

exports.OpenStreetMap = OpenStreetMap;