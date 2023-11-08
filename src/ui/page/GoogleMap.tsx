import * as React from "react";
import { useEffect, useReducer, Reducer } from "react";
import { Button } from "figma-styled-components";

import { useGoogleMapContext, GoogleMapOptions } from "../hooks/useGoogleMap";
import { useMapboxContext, MapboxOptions } from "../hooks/useMapbox";
import { GoogleMapInputs } from "../components/GoogleMapInputs";
import {Main} from "./main";
import {GoogleNext} from "./GoogleNext";
// import { Line } from "../components/Line";
// import { ChevronsLeft } from "../icons/ChevronsLeft";
// import { ChevronsRight } from "../icons/ChevronsRight";

import "figma-plugin-types";
import "../figma-ui.min.css";
import "../style-box.css";

type Options = GoogleMapOptions | MapboxOptions;

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
const send = async (host: Tab, url: string, options: Options) => {
  console.log("options", options);
  console.log("host", host);

  let init_width = options.width;
  let init_height = options.height;
  console.log("init_width_height:", init_width, init_height);
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  parent.postMessage(
    {
      pluginMessage: {
        type: "image",
        width: init_width,
        height: init_height,
        image: new Uint8Array(buffer),
        options: {
          [host]: options,
        },
      },
    },
    "*"
  );
};

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

export const GoogleMap = () => {
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

  const [googleStore, googleDispatch] = useGoogleMapContext();
  const [mapboxStore, mapboxDispatch] = useMapboxContext();
  var style = "";
  if(googleStore.options.json != null) {
    for( var i = 0 ; i < 50 ; i++) {
     
      style += googleStore.options.json[i];
    }
    style += "..."
  }
  
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
          mapboxDispatch({ type: "INPUT_OPTIONS", value: options.mapbox });
          dispatch({ type: "CHANGE_TAB", tab: "mapbox" });
        }

        if (options.googleMap) {
          googleDispatch({ type: "INPUT_OPTIONS", value: options.googleMap });
          dispatch({ type: "CHANGE_TAB", tab: "googleMap" });
        }
      }
    };

    window.parent.postMessage(
      { pluginMessage: { type: "fetch-initial-data" } },
      "*"
    );
  }, []);
  const [googleFlag, setGoogleFlag] = React.useState(1);
  const handleGoogleMap = () => {
    setGoogleFlag(2)
  }
  const handleNextMap = () => {
    setGoogleFlag(3)
  }

  return (
    <div>
      {googleFlag === 1 ?
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
      className="mapbox"
    >
      <div style={{ width: 300, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto" }}>
          <div
            style={{
              display: "flex",
              padding: "0 16px",
              marginTop: 12,
              alignItems: "center",
            }}
          >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="keyboard-backspace" onClick={() => {
            handleGoogleMap();
          }}>
            <g clip-path="url(#clip0_3_443)">
            <path d="M13.125 6.875H4.26875L6.50625 4.63125L5.625 3.75L1.875 7.5L5.625 11.25L6.50625 10.3688L4.26875 8.125H13.125V6.875Z" fill="black"/>
            </g>
            <defs>
            <clipPath id="clip0_3_443">
            <rect width="15" height="15" fill="white"/>
            </clipPath>
            </defs>
          </svg>  
          <div className="text-wrapper-3">Back</div>
          </div>
          <div className="text-wrapper-13">Custom Style</div>
          <div className="text-wrapper-15">{googleStore.options.json ? `(style input - ${style})` : "" }</div>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-forward" onClick={() => {
            handleNextMap()
          }}>
            <g clip-path="url(#clip0_10_2601)">
            <path d="M7.5 2.5L6.61875 3.38125L10.1062 6.875H2.5V8.125H10.1062L6.61875 11.6187L7.5 12.5L12.5 7.5L7.5 2.5Z" fill="#4739E4"/>
            </g>
            <defs>
            <clipPath id="clip0_10_2601">
            <rect width="15" height="15" fill="white"/>
            </clipPath>
            </defs>
          </svg>
            <GoogleMapInputs />
        </div>
        <div style={{ padding: "8px 9px 8px 8px" }}>
          <Button
            variant="primary"
            style={{  backgroundColor: "#4739E4", position: "absolute", width: "284px", top: "482px" }}
            onClick={() => {
              if (store.tab === "googleMap") {
                send("googleMap", googleStore.url, googleStore.options);
              }

              if (store.tab === "mapbox") {
                send("mapbox", mapboxStore.url, mapboxStore.options);
              }
            }}
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
          <img
            style={{ width: "100%", height: 520 }}
            src={
              store.tab === "googleMap"
                ? googleStore.url
                : store.tab === "mapbox"
                ? mapboxStore.url
                : undefined
            }
          />
        </div>
      )}
      </div>
      : ""
      }
      {googleFlag === 2 ?
        <Main />
      :""}
      {googleFlag === 3 ?
      
        <GoogleNext />
      :""}
    </div>
  );
};
