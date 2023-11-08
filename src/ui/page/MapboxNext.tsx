import * as React from "react";
// import { useEffect, useReducer, Reducer } from "react";
import { Button } from "figma-styled-components";

// import { useGoogleMapContext} from "../hooks/useGoogleMap";

import {MapBox} from "./MapBox";
import {MapMark1} from "../icons/MapMark1"

import "figma-plugin-types";
import "../figma-ui.min.css";
import "../style-box.css";
import { useMapboxContext } from "../hooks/useMapbox";

export const MapboxNext = () => {
    const [store, dispatch] = useMapboxContext();
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
              <MapMark1></MapMark1>
              <div>
                <div className="text-wrapper-17">Mapbox Username</div>
                <div>
                  <div className="addjson" style={{ margin: "4px 8px 0" , position: 'absolute', top: '360px'}}>
                      <input
                        style={{
                            position: "absolute",
                            top: "-220px",
                            width: "284px",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px black solid"
                            }}
                        type="text"
                        onChange={(e: any) => {
                        const val = e.target.value;
                        if (val < 0) return;
                        if (val !== "") {
                            dispatch({
                                type: "INPUT_NAME",
                                value: e.target.value,
                            });
                        } else {
                            dispatch({
                                type: "INPUT_NAME",
                                value: "",
                            });
                        }
                        }}
                        placeholder="ergum"
                        value={store.options.name}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="text-wrapper-16">Mapbox Style ID</div>
                <div>
                  <div className="addjson" style={{ margin: "4px 8px 0" , position: 'absolute', top: '360px'}}>
                  <input
                      style={{
                          position: "absolute",
                          top: "-132px",
                          width: "284px",
                          height: "40px",
                          borderRadius: "5px",
                          border: "1px black solid"
                      }}
                      type="text"
                      onChange={(e: any) => {
                      const val = e.target.value;
                      if (val < 0) return;
                      if (val !== "") {
                          dispatch({
                              type: "INPUT_STYLEID",
                              value: e.target.value,
                          });
                      } else {
                          dispatch({
                              type: "INPUT_STYLEID",
                              value: "",
                          });
                      }
                      }}
                      placeholder="ckg6ps8s62b5e19nrr67wqw9u"
                      value={store.options.styleID}
                  />
                  </div>
                </div>
              </div>
            </div>
              </div>
    
            <div style={{ padding: "8px 9px 8px 8px" }}>
              <Button
                variant="primary"
                style={{  backgroundColor: "#4739E4", position: "absolute", width: "284px", top: "300px", height: "40px", fontSize: "15px" }}
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
            style={{ width: "100%", height: 540 }}
            src={
              "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/139.7263785,35.6652065,12,0,0/500x500@2x?access_token=pk.eyJ1IjoiY2xpbnRvMyIsImEiOiJjbG80bHFlZ3UwMnU1MnJvOHFuYzNnd2M1In0.5z9-vaG_2lD6VCUOSNoOgw"
            }
          />
        </div>
        </div>
        : ""
        }
        {googleFlag === 2 ?
          <MapBox />
        :""}
        {googleFlag === 3 ?
          <MapBox />
        :""}
        
      </div>
    );
}
