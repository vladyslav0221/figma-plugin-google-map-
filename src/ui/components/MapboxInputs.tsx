import * as React from "react";
import { useRef, useEffect } from "react";
// import { Select } from "figma-styled-components";

// import { useMapboxContext } from "../hooks/useMapbox";
import {MapMark} from "../icons/MapMark";

interface IMap {
  handleViewportChange: any;
  viewport: any;
  setMapboxtype: any;
  setHeight: any;
  setWidth: any;
}


const MapboxInputs: React.FC<IMap> = ({
  viewport,
  handleViewportChange,
  setMapboxtype,
  setHeight,
  setWidth
}) => {
  // const [store, dispatch] = useMapboxContext();
  // const [maptype, setMaptype] = useState("streets-v11");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current !== null) {
      input.current.focus();
    }
  }, []);
  // useEffect(() => {
  //   if (
  //     maptype === "streets-v11" ||
  //     maptype === "light-v10" ||
  //     maptype === "dark-v10" ||
  //     maptype === "outdoors-v11" ||
  //     maptype === "satellite-v9" ||
  //     maptype === "satellite-streets-v11" 
  //   ) {
  //     console.log("maptype:", maptype);
  //     dispatch({
  //       type: "INPUT_TYPE",
  //       value: maptype,
  //     });
  //   }
  // }, [maptype]);

  return (
    <div style={{marginTop: "40px"}}>
      <MapMark></MapMark>
      <p className="text-wrapper-5">Default map styles from Mapbox</p>
      <div className="text-wrapper-6">Map Style</div>
      

      <div>
        <div style={{ padding: "4px 8px 0" }}>
          <select
            className="maptypeselect"
            onChange={(e) => {
              console.log("maptypeselectoptions:", e.target.value);
              setMapboxtype(e.target.value);
              
            }}
          >
            <option value="streets-v11">Streets</option>
            <option value="light-v10">Light</option>
            <option value="dark-v10">Dark</option>
            <option value="outdoors-v11">Outdoors</option>
            <option value="satellite-v9">Satellite</option>
            <option value="satellite-streets-v11">
              Satellite with streets
            </option>
          </select>
        </div>
      </div>
      <div className="text-wrapper-10">Longitude</div>
      <div className="text-wrapper-11">Map Properties</div>
      <div className="text-wrapper-12">Image Size</div>
      
      <div className="text-wrapper-9">Width</div>
      <div className="text-wrapper-8">Zoom</div>
      <div className="text-wrapper-7">Latitude</div>
      <div>
        <div className="zoomlevel" style={{ margin: "4px 8px 0" , position: 'absolute', top: '360px'}}>
          <input
            type="number"
            min="0"
            max="22"
            step="any"
            name="zoom"
            onChange={e => {
              if (Number(e.target.value) > 22) {
                handleViewportChange(e, 22);
              } else if (Number(e.target.value) < 0) {
                handleViewportChange(e, 0);
              } else {
                handleViewportChange(e, e.target.value);
              }
              
            }}
            value={viewport.zoom}
          />
        </div>
      </div>
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
                setWidth(val);
                
              }}
              // value={store.options.width}
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
                setHeight(val);
                
              }}
              // value={store.options.height}
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
            <input 
              type="number"
              min="-85"
              max="85"
              step="any"
              name="latitude"
              onChange={e => {
                if (Number(e.target.value) > 85) {
                  handleViewportChange(e, 85);
                } else if (Number(e.target.value) < -85) {
                  handleViewportChange(e, -85);
                } else {
                  handleViewportChange(e, e.target.value);
                }
              }}
              value={viewport.latitude}
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
              min="-180"
              max="180"
              step="any"
              name="longitude"
              value={viewport.longitude}
              onChange={e => {
                
                if (Number(e.target.value) > 180) {
                  handleViewportChange(e, 180);
                } else if (Number(e.target.value) < -180) {
                  handleViewportChange(e, -180);
                } else {
                  handleViewportChange(e, e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { MapboxInputs };
