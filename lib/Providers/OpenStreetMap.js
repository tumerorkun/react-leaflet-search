'use strict';

exports.__esModule = true;
class OpenStreetMap {
  constructor() {
    this.url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1&q=';
  }

  async search(query) {
    // console.log(this.url + query)
    const response = await fetch(this.url + query).then(res => res.json());
    return this.formatResponse(response);
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