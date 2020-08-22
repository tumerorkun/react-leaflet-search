import { Provider, ProviderOptions } from "./Provider";

export type OpenStreetMapResponse = Array<{ boundingbox: string[]; lat: number; lon: number; display_name: string }>;

class OpenStreetMap implements Provider<OpenStreetMapResponse> {
    url: string;

    constructor(options?: ProviderOptions) {
        //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
        // We convert them into a string of 'x1,y1,x2,y2' which is the opposite way around from lat/lng - it's lng/lat
        let boundsUrlComponent = "";
        let regionUrlComponent = "";
        if (options && options.searchBounds && options.searchBounds.length) {
            const reversedBounds = options.searchBounds.reduce((acc: number[], b) => [...acc, b.lng, b.lat], []);
            boundsUrlComponent = `&bounded=1&viewbox=${reversedBounds.join(",")}`;
        }
        if (options && "region" in options) {
            regionUrlComponent = `&countrycodes=${options.region}`;
        }
        this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=`;
    }

    async search(query: string): Promise<{ info: string; raw: OpenStreetMapResponse } | { error: string }> {
        const rawResponse = await fetch(this.url + query);
        const response = await rawResponse.json();
        return this.formatResponse(response);
    }

    formatResponse(response: OpenStreetMapResponse): { info: string; raw: OpenStreetMapResponse } | { error: string } {
        const resources = response;
        const count = response.length;
        const info =
            count > 0
                ? resources.map((e) => ({
                      bounds: e.boundingbox.map((bound) => Number(bound)),
                      latitude: Number(e.lat),
                      longitude: Number(e.lon),
                      name: e.display_name,
                  }))
                : "Not Found";
        return {
            info: info as string,
            raw: response as OpenStreetMapResponse,
        };
    }
}

export { OpenStreetMap };
