import * as React from "react";
// import { useEffect, useReducer, Reducer } from "react";
import { Button } from "figma-styled-components";

import { useGoogleMapContext} from "../hooks/useGoogleMap";
// import {  MapboxOptions } from "../hooks/useMapbox";
// import { MapboxInputs } from "../components/MapboxInputs";
// import { GoogleMapInputs } from "../components/GoogleMapInputs";
import {GoogleMap} from "./GoogleMap";
import {GoogleMark} from "../icons/GoogleMark"
// import { Line } from "../components/Line";
// import { ChevronsLeft } from "../icons/ChevronsLeft";
// import { ChevronsRight } from "../icons/ChevronsRight";

import "figma-plugin-types";
import "../figma-ui.min.css";
import "../style-box.css";

// type Options = GoogleMapOptions | MapboxOptions;

// type Tab = "googleMap" | "mapbox";

// interface Store {
//   tab: Tab;
//   hidePreview: boolean | null;
// }

// interface ChangeTabAction {
//   type: "CHANGE_TAB";
//   tab: Tab;
// }

// interface HidePreviewAction {
//   type: "HIDE_PREVIEW";
// }

// interface ShowPreviewAction {
//   type: "SHOW_PREVIEW";
// }

// type Action = ChangeTabAction | HidePreviewAction | ShowPreviewAction;

//  send("googleMap", googleStore.url, googleStore.options);
// const send = async (host: Tab, url: string, options: Options) => {
//   console.log("options", options);
//   console.log("host", host);

//   let init_width = options.width;
//   let init_height = options.height;
//   console.log("init_width_height:", init_width, init_height);
//   const response = await fetch(url);
//   const buffer = await response.arrayBuffer();
//   parent.postMessage(
//     {
//       pluginMessage: {
//         type: "image",
//         width: init_width,
//         height: init_height,
//         image: new Uint8Array(buffer),
//         options: {
//           [host]: options,
//         },
//       },
//     },
//     "*"
//   );
// };

// const Tab = ({
//   label,
//   active,
//   onClick,
// }: {
//   onClick: () => void;
//   label: string;
//   active: boolean;
// }) => (
//   <div
//     style={{
//       marginRight: 16,
//       color: active ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)",
//       cursor: "default",
//     }}
//     onClick={onClick}
//     className="type--11-pos-medium"
//   >
//     {label}
//   </div>
// );

export const GoogleNext = () => {
  

  const [store, dispatch] = useGoogleMapContext();

 
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
          <div style={{marginTop: "40px"}}>
            <GoogleMark />
            <div>
              <div className="text-wrapper-4">Add JSON here</div>
              <p className="p">Copy/paste the JSON snippet from the Google Maps design interface</p>
              <div>
                <div className="addjson" style={{ margin: "4px 8px 0" , position: 'absolute', top: '360px'}}>
               
                  <textarea
                    style={{
                      position: "absolute",
                      top: "-220px",
                      width: "284px",
                      borderRadius: "5px",
                      height: "300px",
                      padding: "10px",
                      border: "1px black solid"
                    }}
                    onInput={(e: any) =>
                      dispatch({ type: "INPUT_JSON", value: e.target.value })
                    }
                    placeholder="Enter JSON here"
                  >
                    {store.options.json}
                  </textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 9px 8px 8px" }}>
            <Button
              variant="primary"
              style={{  backgroundColor: "#4739E4", position: "absolute", width: "284px", top: "482px" }}
              onClick={() => {
                handleNextMap();
              }}
            >
            Next
          </Button>
        </div>
      
      </div>
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
            "https://maps.googleapis.com/maps/api/staticmap?scale=2&center=San%20Francisco%20US&zoom=15&size=600x600&maptype=roadmap&key=AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM"
          }
        />
      </div>
      </div>
      : ""
      }
      {googleFlag === 2 ?
        <GoogleMap />
      :""}
      {googleFlag === 3 ?
        <GoogleMap />
        // <MapBox />
      :""}
    </div>
  );
};
