import createUseContext from "constate";
import { useReducer, useEffect, Reducer } from "react";
import { useDebounce } from "use-debounce";

import { convert } from "../googleStyleConverter";

interface GoogleMapOptions {
  address: string;
  type: "roadmap" | "satellite" | "hybrid" | "terrain";
  marker: boolean;
  zoom: number | "";
  json: string;
  width: number | "";
  height: number | "";
  latitude: number | "";
  longitude: number | "";
}

interface InternalStore {
  options: GoogleMapOptions;
  url: string;
}

interface InputZoomAction {
  type: "INPUT_ZOOM";
  value: number | "";
}
interface InputLatitudeAction {
  type: "INPUT_LATITUDE";
  value: number | "";
}
interface InputLongitudeAction {
  type: "INPUT_LONGITUDE";
  value: number | "";
}

interface InputMapTypeAction {
  type: "INPUT_MAP_TYPE";
  value: "roadmap" | "satellite" | "hybrid" | "terrain";
}

interface InputAddressAction {
  type: "INPUT_ADDRESS";
  value: string;
}

interface InputMarkerAction {
  type: "INPUT_MARKER";
  value: boolean;
}

interface InputWidthAction {
  type: "INPUT_WIDTH";
  value: number | "";
}

interface InputHeightAction {
  type: "INPUT_HEIGHT";
  value: number | "";
}
interface InputJsonAction {
  type: "INPUT_JSON";
  value: string;
}

interface InputOptionsAction {
  type: "INPUT_OPTIONS";
  value: GoogleMapOptions;
}

interface SetUrlAction {
  type: "SET_URL";
  url: string;
}

type Action =
  | InputAddressAction
  | InputZoomAction
  | InputMarkerAction
  | InputWidthAction
  | InputHeightAction
  | InputMapTypeAction
  | InputJsonAction
  | InputLatitudeAction
  | InputLongitudeAction
  | InputOptionsAction
  | SetUrlAction;

const generateUrl = ({
  address,
  type,
  marker,
  zoom,
  // draggagle,
  json,
  // width,
  // height

}: GoogleMapOptions) => {
  const encodedAddress = encodeURIComponent(address);

  // const geo_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM`;
  // if there is no address return a default image.
  if (encodedAddress === "") {
    return "https://maps.googleapis.com/maps/api/staticmap?scale=2&center=San%20Francisco%20US&zoom=15&size=500x600&maptype=roadmap&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM";
  }

  const url =
    `https://maps.googleapis.com/maps/api/staticmap?scale=2&center=${encodedAddress}&zoom=${zoom}&size=600x600&maptype=${type}&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM` +
    (marker ? `&markers=color:red|${encodedAddress}` : "") +
    (json ? convert(json) : "");
    console.log("googlemap_url:", url);
  const data_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM`
  return [url, data_url];
};

// const generateGeoUrl = ({
//   address,
//   type

// }: GoogleMapOptions) => {
//   const encodedAddress = encodeURIComponent(address);

//   const geo_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM`;
//   // if there is no address return a default image.
//   if (encodedAddress === "") {
//     return "https://maps.googleapis.com/maps/api/geocode/json?address=San%20Francisco%20US&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM";
//   }

//   return geo_url;
// };

interface Store extends InternalStore {
  url: string;
  jsonIsInvalid: boolean;
}

type Dispatch = (action: Action) => void;

const useGoogleMap = (): [Store, Dispatch] => {
  const [store, dispatch] = useReducer<Reducer<InternalStore, Action>>(
    (state, action) => {
      switch (action.type) {
        case "INPUT_ADDRESS":
          return {
            ...state,
            options: { ...state.options, address: action.value }
          };

        case "INPUT_MAP_TYPE":
          return {
            ...state,
            options: { ...state.options, type: action.value }
          };

        case "INPUT_MARKER":
          return {
            ...state,
            options: { ...state.options, marker: action.value }
          };
        case "INPUT_WIDTH":
          return {
            ...state,
            options: { ...state.options, width: action.value }
          };
        case "INPUT_HEIGHT":
          return {
            ...state,
            options: { ...state.options, height: action.value }
          };
        case "INPUT_JSON":
          return {
            ...state,
            options: { ...state.options, json: action.value }
          };

        case "INPUT_ZOOM":
          return {
            ...state,
            options: { ...state.options, zoom: action.value }
          };
        case "INPUT_LATITUDE":
          return {
            ...state,
            options: { ...state.options, latitude: action.value }
          };
        case "INPUT_LONGITUDE":
          return {
            ...state,
            options: { ...state.options, longitude: action.value }
          };

        case "INPUT_OPTIONS":
          return {
            ...state,
            options: { ...action.value }
          };

        case "SET_URL":
          return {
            ...state,
            url: action.url
          };

        default:
          return state;
      }
    },
    {
      options: {
        address: "",
        type: "roadmap",
        marker: false,
        zoom: 15,
        json: "",
        width: 800,
        height: 600,
        latitude: 0,
        longitude: 0,
      },
      url:
        "https://maps.googleapis.com/maps/api/staticmap?scale=2&center=San%20Francisco%20US&zoom=15&size=500x600&maptype=roadmap&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM"
    }
  );

  let url = generateUrl(store.options)[0];
  let data_url = generateUrl(store.options)[1];
  console.log("url:", url)
  console.log("data_url:", data_url)
  const [debounceAddress] = useDebounce(store.options.address, 1000);

  useEffect(() => {
    const f = async () => {
      if (store.options.address !== "") {
        const response = await fetch(url);
        const data_response = await fetch(data_url);
        console.log("data_response:", data_response);
        const data = await data_response.json();
        const { lat, lng } = data.results[0].geometry.location;

        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        store.options.latitude = lat;
        store.options.longitude = lng;

        const buffer = await response.arrayBuffer();
        parent.postMessage(
          {
            pluginMessage: {
              type: "preview",
              image: new Uint8Array(buffer),
              options: {
                googleMap: store.options
              }
            }
          },
          "*"
        );
        dispatch({ type: "SET_URL", url });
      }
    };

    f();
  }, [
    store.options.json,
    store.options.width,
    store.options.height,
    store.options.marker,
    store.options.type,
    store.options.zoom,
    store.options.latitude,
    store.options.longitude,
    debounceAddress
  ]);

  return [
    {
      jsonIsInvalid:
        store.options.json !== "" && convert(store.options.json) === "",
      ...store
    },
    dispatch
  ];
};

const useGoogleMapContext = createUseContext(useGoogleMap);

export { useGoogleMapContext, GoogleMapOptions, Store, Dispatch };
