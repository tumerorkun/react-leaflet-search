class BingMap {
  constructor(options = { providerKey: null, searchBounds: [] } ) {
    let { providerKey, searchBounds} = options;
    this.key = providerKey;
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2'
    let boundsUrlComponent = "";
    if (searchBounds.length) {
      this.bounds = [].concat([],...searchBounds).join(",");
      boundsUrlComponent = `&umv=${this.bounds}`;
    }
    this.url = `https://dev.virtualearth.net/REST/v1/Locations?output=json${boundsUrlComponent}&key=${this.key}&q=`
  }

  async search(query) {
    if (typeof this.key === 'undefined') { return { error: 'BingMap requires an api key' } }
    // console.log(this.url + query)
    const response = await fetch(this.url + query)
      .then(res => res.json());
    return this.formatResponse(response)
  }

  formatResponse(response) {
    // console.log(response)
    const resources = response.resourceSets[0].resources;
    const count = response.resourceSets[0].estimatedTotal;
    // console.log(resources)
    const info = (count > 0) ? resources.map(e => ({
      bounds: e.bbox.map(bound => Number(bound)),
      latitude: Number(e.point.coordinates[0]),
      longitude: Number(e.point.coordinates[1]),
      name: e.name,
    })) : 'Not Found';
    return {
      info: info,
      raw: response
    }
  }

}

export { BingMap }
