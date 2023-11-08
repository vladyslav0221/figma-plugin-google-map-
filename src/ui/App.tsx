import * as React from "react";
import { render } from "react-dom";
import { useGoogleMapContext } from "./hooks/useGoogleMap";
import { useMapboxContext } from "./hooks/useMapbox";
import "figma-plugin-types";
import { Main } from "./page/main";

render(
  <useGoogleMapContext.Provider>
    <useMapboxContext.Provider>
      <Main />
    </useMapboxContext.Provider>
  </useGoogleMapContext.Provider>,
  document.getElementById("app")
);
