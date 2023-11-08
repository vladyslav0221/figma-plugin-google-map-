import * as React from "react";
import {
  useEffect,
  useReducer,
  Reducer,
  useRef,
  useCallback,
  useState,
} from "react";
import { Button } from "figma-styled-components";

// import { useGoogleMapContext} from "../hooks/useGoogleMap";
// import { useMapboxContext } from "../hooks/useMapbox";
import { MapboxInputs } from "../components/MapboxInputs";
import { Main } from "./main";
import { MapboxNext } from "./MapboxNext";
// import ReactMapGL from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import "figma-plugin-types";
import "../figma-ui.min.css";
import "../style-box.css";
import { useMapboxContext } from "../hooks/useMapbox";

export type MapConfig = {
  avatar: string;
  maxZoom: number;
  minZoom: number;
  style: string;
  accessToken: string;
  title: string;
  type?: string;
};

export type Location = {
  lat: number;
  lng: number;
};
// type Options = GoogleMapOptions | MapboxOptions;

type Tab = "googleMap" | "mapbox";

interface Store {
  tab: Tab;
  hidePreview: boolean | null;
}

interface ChangeTabAction {
  type: "CHANGE_TAB";
  tab: Tab;
}

interface HidePreviewAction {
  type: "HIDE_PREVIEW";
}

interface ShowPreviewAction {
  type: "SHOW_PREVIEW";
}

type Action = ChangeTabAction | HidePreviewAction | ShowPreviewAction;

//  send("googleMap", googleStore.url, googleStore.options);

const Tab = ({
  label,
  active,
  onClick,
}: {
  onClick: () => void;
  label: string;
  active: boolean;
}) => (
  <div
    style={{
      marginRight: 16,
      color: active ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)",
      cursor: "default",
    }}
    onClick={onClick}
    className="type--11-pos-medium"
  >
    {label}
  </div>
);

export const MapBox = ({}) => {
  // const inputUsername = useRef(null);
  // const inputStyleID = useRef(null);
  console.log("maptboxfirst--------------------------");
  const [username, setUsername] = useState("ergum");
  const [customStyleID, setCustomStyleID] = useState(
    "ckg6ps8s62b5e19nrr67wqw9u"
  );
  React.useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "read-storage",
        },
      },
      "*"
    );
    parent.postMessage(
      {
        pluginMessage: {
          type: "ask-editorType",
        },
      },
      "*"
    );

    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      console.log("-----------msg-------------");
      const { type, message, storage } = event.data.pluginMessage;
      if (type === "map-drawed") {
        console.log(`Figma Says: ${message}`);
      }

      let notifyStorage = false;
      if (
        type === "fetched username" &&
        storage != undefined &&
        storage != "ergum"
      ) {
        setUsername(storage);
        console.log("setUsername --->", storage);
        notifyStorage = true;
      }
      if (
        type === "fetched custom style" &&
        storage != undefined &&
        storage != "ckg6ps8s62b5e19nrr67wqw9u"
      ) {
        setCustomStyleID(storage);
        console.log("setCustomStyleID --->", storage);
        notifyStorage = true;
      }
      if (notifyStorage) {
        parent.postMessage(
          {
            pluginMessage: {
              type: "notify-storage",
              user: username,
              style: customStyleID,
            },
          },
          "*"
        );
      }
    };
  }, []);

  React.useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "update-storage",
          user: username,
          style: customStyleID,
        },
      },
      "*"
    );
  }, [username, customStyleID]);

  const [store, dispatch] = useReducer<Reducer<Store, Action>>(
    (state, action) => {
      switch (action.type) {
        case "CHANGE_TAB":
          return { ...state, tab: action.tab };

        case "HIDE_PREVIEW":
          return { ...state, hidePreview: true };

        case "SHOW_PREVIEW":
          return { ...state, hidePreview: false };

        default:
          return state;
      }
    },
    {
      tab: "googleMap",
      hidePreview: null,
    }
  );
  // const [googleStore, googleDispatch] = useGoogleMapContext();
  const [mapboxStore] = useMapboxContext();
  console.log("mapboxStore:", mapboxStore);
  // mapboxDispatch({ type: "INPUT_OPTIONS", value: });
  const [mapboxtype, setMapboxtype] = useState("streets-v11");
  const [height, setHeight] = useState("800");
  const [width, setWidth] = useState("600");
  const onDrawMap = async () => {
    let imurl = `https://api.mapbox.com/styles/v1/${mapboxStore.options.name? mapboxStore.options.name: "mapbox"}/${mapboxStore.options.styleID? mapboxStore.options.styleID : mapboxtype}/static/${viewport.longitude},${viewport.latitude},${viewport.zoom},${viewport.bearing},${viewport.pitch}/${height}x${width}?access_token=pk.eyJ1IjoiY2xpbnRvMyIsImEiOiJjbG80bHFlZ3UwMnU1MnJvOHFuYzNnd2M1In0.5z9-vaG_2lD6VCUOSNoOgw&attribution=false&logo=false`;

    console.log("init_width_height:", width, height);
    const response = await fetch(imurl);
    const buffer = await response.arrayBuffer();
    parent.postMessage(
      {
        pluginMessage: {
          type: "image",
          width: Number(width),
          height: Number(height),
          image: new Uint8Array(buffer),
        },
      },
      "*"
    );
  };

  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;

      if (msg.type === "set-preview") {
        if (msg.preview) {
          dispatch({ type: "SHOW_PREVIEW" });
        } else {
          dispatch({ type: "HIDE_PREVIEW" });
        }
      }

      if (msg.type === "set-options") {
        if (!msg.options) {
          return;
        }

        const options = JSON.parse(msg.options);

        if (options.mapbox) {
          // mapboxDispatch({ type: "INPUT_OPTIONS", value: options.mapbox });
          dispatch({ type: "CHANGE_TAB", tab: "mapbox" });
        }
      }
    };

    window.parent.postMessage(
      { pluginMessage: { type: "fetch-initial-data" } },
      "*"
    );
  }, []);
  const [googleFlag, setGoogleFlag] = React.useState(1);
  // const [styleFlag, setStyleFlag] = React.useState(1);
  const handleGoogleMap = () => {
    setGoogleFlag(2);
  };
  const handleNextMap = () => {
    console.log("userName:", username);
    console.log("customSytleId:", customStyleID);
    // setStyleFlag(2);
    setGoogleFlag(3);
  };

  let [viewport, setViewport] = useState({
    longitude: -77.03968,
    latitude: 38.89744,
    zoom: 8,
    bearing: 0,
    pitch: 0,
    width: 560,
    height: 560,
  });
  const mapRef = useRef();
  const handleViewportChange = (e, value) => {
    setViewport({
      ...viewport,
      [e.target.name]: Number(value),
    });
  };

  const handleViewportMapChange = (viewport) => {
    setViewport(viewport);
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return setViewport({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);

  return (
    <div>
      {googleFlag === 1 ? (
        <div>
          <div
            style={{
              height: "100%",
              display:  "flex" ,
              flexDirection: "row",
            }}
            className="mapbox"
          >
            <div
              style={{ width: 300, display: "flex", flexDirection: "column" }}
            >
              <div style={{ flex: 1, overflow: "auto" }}>
                <div
                  style={{
                    display: "flex",
                    padding: "0 16px",
                    marginTop: 12,
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="keyboard-backspace"
                    onClick={() => {
                      handleGoogleMap();
                    }}
                  >
                    <g clip-path="url(#clip0_3_443)">
                      <path
                        d="M13.125 6.875H4.26875L6.50625 4.63125L5.625 3.75L1.875 7.5L5.625 11.25L6.50625 10.3688L4.26875 8.125H13.125V6.875Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3_443">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="text-wrapper-3">Back</div>
                </div>
                <div className="text-wrapper-13">Custom Style</div>
                <div className="text-wrapper-15">
                  {mapboxStore.options.styleID ? `(style input - ${mapboxStore.options.styleID})` : ""}
                </div>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="arrow-forward"
                  onClick={() => {
                    handleNextMap();
                  }}
                >
                  <g clip-path="url(#clip0_10_2601)">
                    <path
                      d="M7.5 2.5L6.61875 3.38125L10.1062 6.875H2.5V8.125H10.1062L6.61875 11.6187L7.5 12.5L12.5 7.5L7.5 2.5Z"
                      fill="#4739E4"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_2601">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <MapboxInputs
                  viewport={viewport}
                  handleViewportChange={handleViewportChange}
                  setMapboxtype={setMapboxtype}
                  setHeight={setHeight}
                  setWidth={setWidth}
                />
              </div>
              <div style={{ padding: "8px 9px 8px 8px" }}>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#4739E4",
                    position: "absolute",
                    width: "284px",
                    top: "482px",
                  }}
                  onClick={onDrawMap}
                >
                  Draw map to Figma
                </Button>
              </div>
            </div>
            {!store.hidePreview && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* <div style={{ width: "100%", height: 500 }}></div> */}
                {/* <img
              style={{ width: "100%", height: 520 }}
              src={
                store.tab === "googleMap"
                  ? googleStore.url
                  : store.tab === "mapbox"
                  ? mapboxStore.url
                  : undefined
              }
            /> */}
                <div>
                  <MapGL
                    {...viewport}
                    ref={mapRef}
                    width="100%"
                    height="540px"
                    onViewportChange={handleViewportMapChange}
                    mapboxApiAccessToken="pk.eyJ1IjoiY2xpbnRvMyIsImEiOiJjbG80bHFlZ3UwMnU1MnJvOHFuYzNnd2M1In0.5z9-vaG_2lD6VCUOSNoOgw"
                    mapStyle={`mapbox://styles/mapbox/${mapboxtype}`}
                  />
                  <Geocoder
                    mapRef={mapRef}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken="pk.eyJ1IjoiY2xpbnRvMyIsImEiOiJjbG80bHFlZ3UwMnU1MnJvOHFuYzNnd2M1In0.5z9-vaG_2lD6VCUOSNoOgw"
                    position="top-left"
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        ""
      )}
      {googleFlag === 2 ? <Main /> : ""}
      {googleFlag === 3 ?
      
        <MapboxNext 
        />
      :""}
    </div>
  );
};
