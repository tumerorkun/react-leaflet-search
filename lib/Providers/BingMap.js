'use strict';

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BingMap {
  constructor(providerkey) {
    this.key = providerkey;
    this.url = `https://dev.virtualearth.net/REST/v1/Locations?output=json&key=${this.key}&q=`;
  }

  search(query) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (typeof _this.key === 'undefined') {
        return { error: 'BingMap requires an api key' };
      }
      // console.log(this.url + query)
      const response = yield fetch(_this.url + query).then(function (res) {
        return res.json();
      });
      return _this.formatResponse(response);
    })();
  }

  formatResponse(response) {
    // console.log(response)
    const resources = response.resourceSets[0].resources;
    const count = response.resourceSets[0].estimatedTotal;
    // console.log(resources)
    const info = count > 0 ? resources.map(e => ({
      bounds: e.bbox.map(bound => Number(bound)),
      latitude: Number(e.point.coordinates[0]),
      longitude: Number(e.point.coordinates[1]),
      name: e.name
    })) : 'Not Found';
    return {
      info: info,
      raw: response
    };
  }

}

exports.BingMap = BingMap;