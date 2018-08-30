class OpenStreetMap {
  constructor({ providerKey=null, searchBounds=[] } = {}) {
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2'
    let boundsUrlComponent = "";
    if (searchBounds.length) {
      this.bounds = [].concat([],...searchBounds).join(",");
      boundsUrlComponent = `&viewbox=${this.bounds}`;
    }
    this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}&q=`
  }

  async search(query) {
    // console.log(this.url + query)
    const response = await fetch(this.url + query)
      .then(res => res.json());
    return this.formatResponse(response)
  }

  formatResponse(response) {
    const resources = response;
    const count = response.length;
    const info = (count > 0) ? resources.map(e => ({
      bounds: e.boundingbox.map(bound => Number(bound)),
      latitude: Number(e.lat),
      longitude: Number(e.lon),
      name: e.display_name,
    })) : 'Not Found';
    return {
      info: info,
      raw: response
    }
  }

}

export { OpenStreetMap }
