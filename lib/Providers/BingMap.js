'use strict';

exports.__esModule = true;
class BingMap {
  constructor(providerkey) {
    this.key = providerkey;
    this.url = `https://dev.virtualearth.net/REST/v1/Locations?output=json&key=${this.key}&q=`;
  }

  async search(query) {
    if (typeof this.key === 'undefined') {
      return { error: 'BingMap requires an api key' };
    }
    // console.log(this.url + query)
    const response = await fetch(this.url + query).then(res => res.json());
    return this.formatResponse(response);
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