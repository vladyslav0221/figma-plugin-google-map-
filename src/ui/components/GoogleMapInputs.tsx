import * as React from "react";
import { useRef, useEffect, useState } from "react";
// import {  Checkbox } from "figma-styled-components";
import { useGoogleMapContext } from "../hooks/useGoogleMap";
// import { Line } from "./Line";
// import { Label } from "./Label";
import Autocomplete from "../../../node_modules/react-google-autocomplete";
import {GoogleMark} from "../icons/GoogleMark"

const GoogleMapInputs = () => {
  const [store, dispatch] = useGoogleMapContext();
  const [zoomLevel, setZoomLevel] = useState(store.options.zoom);
  const [maptype, setMaptype] = useState("roadmap");
  const input = useRef<HTMLInputElement>(null);
  

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      maptype === "roadmap" ||
      maptype === "satellite" ||
      maptype === "hybrid" ||
      maptype === "terrain"
    ) {
      console.log("maptype:", maptype);
      dispatch({
        type: "INPUT_MAP_TYPE",
        value: maptype,
      });
    }
  }, [maptype]);
  useEffect(() => {
    const handleScroll = (event: { deltaY: number }) => {
      if (event.deltaY > 0) {
        // Zoom out
        setZoomLevel((prevZoomLevel: number) => {
          if (prevZoomLevel > 1) {
            return prevZoomLevel - 1;
          } else {
            return prevZoomLevel;
          }
        });
      } else {
        // Zoom in
        setZoomLevel((prevZoomLevel: number) => {
          if(prevZoomLevel < 21){
            return prevZoomLevel + 1
          } else{
            return prevZoomLevel
          }
        });
      }
    };

    // Add event listener to the component
    window.addEventListener("wheel", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: "INPUT_ZOOM",
      value: zoomLevel,
    });
  }, [zoomLevel]);

  // const [nextFlag, setNextFlag] = React.useState(1);
  // const handleNext = () => {
  //   setNextFlag(2);
  // }

  return (
    // <div>
    //   {nextFlag === 1 ?
    <div style={{marginTop: "40px"}}>
      <GoogleMark />
      <div>
        <div className="text-wrapper-4">Focus Address</div>
        <p className="p">Where would you like the map to focus?</p>
        <p className="text-wrapper-5">Default map styles from Mapbox</p>
        <div className="text-wrapper-6">Map Style</div>
        <div className="googlemap_autocomplete">
          <Autocomplete
            apiKey={"AIzaSyDBozHahWrNFkc5dFmngpNGGIMygj7OnPM"}
            onPlaceSelected={(place: any) => {
              console.log("autocomplete_address:", place.formatted_address);
              dispatch({
                type: "INPUT_ADDRESS",
                value: place.formatted_address,
              });
            }}
          />
        </div>
      </div>
      {/* <Line /> */}
      <div>
        <div style={{ padding: "4px 8px 0" }}>
          <select
            className="maptypeselect"
            onChange={(e) => {
              setMaptype(e.target.value);
            }}
          >
            <option value="roadmap">Roadmap</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>
      <div className="text-wrapper-10">Longitude</div>
      <div className="text-wrapper-11">Map Properties</div>
      <div className="text-wrapper-12">Image Size</div>
      
      <div className="text-wrapper-9">Width</div>
      <div className="text-wrapper-8">Zoom</div>
      <div className="text-wrapper-7">Latitude</div>
      {/* <Line /> */}
      <div>
        {/* <Label label="Zoom Level"></Label> */}
        <div className="zoomlevel" style={{ margin: "4px 8px 0" , position: 'absolute', top: '360px'}}>
          <input
            type="number"
            onChange={(e: any) => {
              const val = e.target.value;
              if (val < 0) return;
              if (val !== "") {
                dispatch({
                  type: "INPUT_ZOOM",
                  value: Number(e.target.value),
                });
              } else {
                dispatch({
                  type: "INPUT_ZOOM",
                  value: "",
                });
              }
            }}
            value={store.options.zoom}
          />
        </div>
      </div>
      
      {/* <div style={{ padding: "0 6px" }}>
        <Checkbox
          checked={store.options.marker}
          label="Show Marker"
          onChange={(e: any) => {
            console.log(e.target.checked);
            dispatch({
              type: "INPUT_MARKER",
              value: e.target.checked,
            });
          }}
        />
      </div>
      <Line /> */}
      <div className="d-flex" style={{position: 'absolute', top: '435px'}}>
        <div>
          {/* <Label label="Width"></Label> */}
          <div
            style={{ padding: "4px 2px 4px 8px" }}
            className="widthheightclass"
          >
            <input
              type="number"
              onChange={(e: any) => {
                const val = e.target.value;
                if (val !== "") {
                  dispatch({
                    type: "INPUT_WIDTH",
                    value: Number(e.target.value),
                  });
                } else {
                  dispatch({
                    type: "INPUT_WIDTH",
                    value: "",
                  });
                }
              }}
              value={store.options.width}
            />
          </div>
        </div>
        <div>
          <div
            style={{ padding: "4px 8px 4px 2px" }}
            className="widthheightclass"
          >
            <input
              type="number"
              onChange={(e: any) => {
                const val = e.target.value;
                if (val !== "") {
                  dispatch({
                    type: "INPUT_HEIGHT",
                    value: Number(e.target.value),
                  });
                } else {
                  dispatch({
                    type: "INPUT_HEIGHT",
                    value: "",
                  });
                }
              }}
              value={store.options.height}
            />
          </div>
        </div>
      </div>
      <div className="d-flex" style={{position: 'absolute', top: '307px'}}>
        <div>
          {/* <Label label="Width"></Label> */}
          <div
            style={{ padding: "4px 2px 4px 8px" }}
            className="widthheightclass"
          >
            <input disabled
              type="number"
              value={store.options.latitude}
            />
          </div>
        </div>
        <div>
          <div
            style={{ padding: "4px 8px 4px 2px" }}
            className="widthheightclass"
          >
            <input disabled
              type="number"
              value={store.options.longitude}
            />
          </div>
        </div>
      </div>
      {/* </div> : ""
      }
      {
        nextFlag === 2 ? 
        "" : ""
      } */}
    </div>
  );
};

export { GoogleMapInputs };
