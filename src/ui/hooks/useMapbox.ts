import createUseContext from "constate";
import { useReducer, useEffect, Reducer } from "react";
import { useDebounce } from "use-debounce";

type MapType =
  | "streets-v11"
  | "outdoors-v11"
  | "light-v10"
  | "dark-v10"
  | "satellite-v9"
  | "satellite-streets-v11"
  | "navigation-preview-day-v4"
  | "navigation-preview-night-v4"
  | "navigation-guidance-day-v4"
  | "navigation-guidance-night-v4";

interface MapboxOptions {
  address: string;
  type: MapType;
  zoom: number;
  bearing: number;
  name: string;
  styleID: string;
  pitch: number;
  width: number | "";
  height: number | "";
  latitude: number | "";
  longitude: number | "";
}

interface InternalStore {
  options: MapboxOptions;
  url: string;
}

interface InputAddressAction {
  type: "INPUT_ADDRESS";
  value: string;
}

interface InputZoomAction {
  type: "INPUT_ZOOM";
  value: number;
}

interface InputTypeAction {
  type: "INPUT_TYPE";
  value: MapType;
}

interface InputBearingAction {
  type: "INPUT_BEARING";
  value: number;
}

interface InputPitchAction {
  type: "INPUT_PITCH";
  value: number;
}

interface InputOptionsAction {
  type: "INPUT_OPTIONS";
  value: MapboxOptions;
}
interface InputLatitudeAction {
  type: "INPUT_LATITUDE";
  value: number | "";
}
interface InputLongitudeAction {
  type: "INPUT_LONGITUDE";
  value: number | "";
}
interface InputWidthAction {
  type: "INPUT_WIDTH";
  value: number | "";
}

interface InputHeightAction {
  type: "INPUT_HEIGHT";
  value: number | "";
}
interface InputNameAction {
  type: "INPUT_NAME";
  value: string;
}
interface InputStyleIDAction {
  type: "INPUT_STYLEID";
  value: string;
}
interface SetUrlAction {
  type: "SET_URL";
  url: string;
}

type Action =
  | InputAddressAction
  | SetUrlAction
  | InputZoomAction
  | InputTypeAction
  | InputBearingAction
  | InputPitchAction
  | InputLatitudeAction
  | InputLongitudeAction
  | InputWidthAction
  | InputHeightAction
  | InputNameAction
  | InputStyleIDAction
  | InputOptionsAction;

const generateUrl = async ({
  address,
  zoom,
  type,
  bearing,
  pitch
}: MapboxOptions) => {
  const token =
    "pk.eyJ1IjoiY2xpbnRvMyIsImEiOiJjbG80bHFlZ3UwMnU1MnJvOHFuYzNnd2M1In0.5z9-vaG_2lD6VCUOSNoOgw";
    const encodedAddress = encodeURIComponent(address);
    console.log("generateUrl:", encodedAddress);

  // if there is no address return a default image.
  if (encodedAddress === "") {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/139.7263785,35.6652065,12,0,0/500x500@2x?access_token=${token}`;
  }

  const placeUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodedAddress +
    `.json?access_token=${token}&limit=1`;

  // TODO: More type Safetly
  const place = await (await fetch(placeUrl)).json();
  console.log("googelmaptype:", type);
  const center = place.features[0].center;
  const url = `https://api.mapbox.com/styles/v1/mapbox/${type}/static/${center.join(
    ","
  )},${zoom},${bearing},${pitch}/500x500@2x?access_token=${token}`;

  return url;
};

interface Store extends InternalStore {
  
}

type Dispatch = (action: Action) => void;

const useMapbox = (): [Store, Dispatch] => {
  const [store, dispatch] = useReducer<Reducer<InternalStore, Action>>(
    (state, action) => {
      switch (action.type) {
        case "INPUT_ADDRESS":
          return {
            ...state,
            options: { ...state.options, address: action.value }
          };

        case "INPUT_TYPE":
          return {
            ...state,
            options: { ...state.options, type: action.value }
          };

        case "INPUT_ZOOM":
          return {
            ...state,
            options: { ...state.options, zoom: action.value }
          };

        case "INPUT_BEARING":
          return {
            ...state,
            options: { ...state.options, bearing: action.value }
          };

        case "INPUT_PITCH":
          return {
            ...state,
            options: { ...state.options, pitch: action.value }
          };

        case "INPUT_OPTIONS":
          return {
            ...state,
            options: action.value
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
        case "INPUT_NAME":
          return {
            ...state,
            options: { ...state.options, name: action.value }
          };
        case "INPUT_STYLEID":
          return {
            ...state,
            options: { ...state.options, styleID: action.value }
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
        zoom: 12,
        name: "",
        styleID: "",
        type: "streets-v11",
        bearing: 0,
        pitch: 0,
        width: 800, 
        height: 600,
        latitude: 0,
        longitude: 0,
      },
      url: ""
    }
  );

  const [debounceAddress] = useDebounce(store.options.address, 1000);

  useEffect(() => {
    console.log("maptype:", store.options)
    const f = async () => {
      const url = await generateUrl(store.options);
      dispatch({ type: "SET_URL", url });
    };

    f();
  }, [
    store.options.zoom,
    store.options.type,
    store.options.pitch,
    store.options.bearing,
    store.options.width,
    store.options.height,
    store.options.latitude,
    store.options.bearing,
    store.options.name,
    store.options.styleID,
    debounceAddress
  ]);

  useEffect(() => {
    const f = async () => {
      const response = await fetch(store.url);
      const buffer = await response.arrayBuffer();
      parent.postMessage(
        {
          pluginMessage: {
            type: "preview",
            image: new Uint8Array(buffer),
            options: {
              mapbox: store.options
            }
          }
        },
        "*"
      );
    };

    f();
  }, [store.url]);

  return [
    {
      ...store
    },
    dispatch
  ];
};

const useMapboxContext = createUseContext(useMapbox);

export { useMapboxContext, MapboxOptions, Store, Dispatch };
