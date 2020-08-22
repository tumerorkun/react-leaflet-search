var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class OpenStreetMap {
    constructor(options) {
        //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
        // We convert them into a string of 'x1,y1,x2,y2' which is the opposite way around from lat/lng - it's lng/lat
        let boundsUrlComponent = "";
        let regionUrlComponent = "";
        if (options && options.searchBounds && options.searchBounds.length) {
            const reversedBounds = options.searchBounds.reduce((acc, b) => [...acc, b.lng, b.lat], []);
            boundsUrlComponent = `&bounded=1&viewbox=${reversedBounds.join(",")}`;
        }
        if (options && "region" in options) {
            regionUrlComponent = `&countrycodes=${options.region}`;
        }
        this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=`;
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield fetch(this.url + query);
            const response = yield rawResponse.json();
            return this.formatResponse(response);
        });
    }
    formatResponse(response) {
        const resources = response;
        const count = response.length;
        const info = count > 0
            ? resources.map((e) => ({
                bounds: e.boundingbox.map((bound) => Number(bound)),
                latitude: Number(e.lat),
                longitude: Number(e.lon),
                name: e.display_name,
            }))
            : "Not Found";
        return {
            info: info,
            raw: response,
        };
    }
}
export { OpenStreetMap };
