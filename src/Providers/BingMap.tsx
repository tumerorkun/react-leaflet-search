import { Provider, ProviderOptions } from "./Provider";

export interface BingMapResponse {
    resourceSets: Array<{
        resources: Array<{ bbox: string[]; point: { coordinates: string[] }; name: string }>;
        estimatedTotal: number;
    }>;
}
class BingMap implements Provider<BingMapResponse> {
    key?: string | null;
    url: string;

    constructor(options?: ProviderOptions) {
        this.key = options?.providerKey;
        //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
        // We convert them into a string of 'x1,y1,x2,y2'
        let boundsUrlComponent = "";
        if (options?.searchBounds?.length) {
            const bounds = options.searchBounds.reduce((acc: number[], b) => [...acc, b.lat, b.lng], []);
            boundsUrlComponent = `&umv=${bounds.join(",")}`;
        }
        this.url = `https://dev.virtualearth.net/REST/v1/Locations?output=json${boundsUrlComponent}&key=${this.key}&q=`;
    }

    async search(query: string): Promise<{ info: string; raw: BingMapResponse } | { error: string }> {
        if (typeof this.key === "undefined") {
            return { error: "BingMap requires an api key" };
        }
        // console.log(this.url + query)
        const response = await fetch(this.url + query).then((res) => res.json());
        return this.formatResponse(response);
    }

    formatResponse(response: BingMapResponse): { info: string; raw: BingMapResponse } | { error: string } {
        const resources = response.resourceSets[0].resources;
        const count = response.resourceSets[0].estimatedTotal;
        const info =
            count > 0
                ? resources.map((e) => ({
                      bounds: e.bbox.map((bound) => Number(bound)),
                      latitude: Number(e.point.coordinates[0]),
                      longitude: Number(e.point.coordinates[1]),
                      name: e.name
                  }))
                : "Not Found";
        return {
            info: info as string,
            raw: response as BingMapResponse
        };
    }
}

export { BingMap };
