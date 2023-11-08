import "figma-plugin-types";

const optionsKey = "options";
const previewKey = "preview";

const width = 800;
const height = 600;
const collapsedWidth = 300;

const main = () => {
  figma.clientStorage.getAsync(previewKey).then(preview => {
    const previewMode = !(preview && preview === "hide");

    figma.showUI(__html__, {
      width: previewMode ? width : collapsedWidth,
      height
    });
  });
};

main();

figma.ui.onmessage = msg => {
  console.log("---------first-------");
  if (msg.type === "fetch-initial-data") {
    figma.clientStorage.getAsync(previewKey).then(preview => {
      const previewMode = !(preview && preview === "hide");

      figma.ui.postMessage({
        type: "set-preview",
        preview: previewMode
      });

      const initialSelection = figma.currentPage.selection;
      if (initialSelection.length >= 1) {
        figma.ui.postMessage({
          type: "set-options",
          options: initialSelection[0].getPluginData(optionsKey)
        });
      }
    });
  }

  if (msg.type === "hide-preview") {
    figma.clientStorage.getAsync(previewKey).then(_ => {
      figma.clientStorage.setAsync(previewKey, "hide");
      figma.ui.resize(collapsedWidth, height);
    });
  }
  if (msg.type === "update-storage") {
    figma.clientStorage.setAsync("_username", msg.user);
    figma.clientStorage.setAsync("_customStyleID", msg.style);
  }
  if (msg.type === "show-preview") {
    figma.clientStorage.setAsync(previewKey, "show");
    figma.ui.resize(width, height);
  }

  if (msg.type === "preview") {
    const selection = figma.currentPage.selection;

    const fillMap = (
      node: RectangleNode | PolygonNode | EllipseNode | VectorNode
    ) => {
      if (msg.options) {
        node.setPluginData(optionsKey, JSON.stringify(msg.options));
      }

      const image = figma.createImage(msg.image);

      node.fills = [
        {
          type: "IMAGE",
          imageHash: image.hash,
          scaleMode: "FILL"
        }
      ];

      return node;
    };

    // Fill all selected fillable node
    selection.forEach(node => {
      if (
        node.type === "RECTANGLE" ||
        node.type === "POLYGON" ||
        node.type === "ELLIPSE" ||
        node.type === "VECTOR"
      ) {
        fillMap(node);
      }
    });
  }
  if (msg.type === "read-storage") {
    console.log("-----------msg--------------");
    figma.clientStorage.getAsync("_username").then(result => {
      figma.ui.postMessage({
        type: "fetched username",
        storage: result
      });
    });
    figma.clientStorage.getAsync("_customStyleID").then(result => {
      figma.ui.postMessage({
        type: "fetched custom style",
        storage: result
      });
    });
    // figma.notify("We restored your map. Default values were: 'ergum' 'ckg6ps8s62b5e19nrr67wqw9u'", {
    //   timeout: 6000
    // });
  }
  if (msg.type === "notify-storage") {
    figma.notify(
      "💾 We restored your Mapbox user and Style ID. Default values were: 'ergum' 'ckg6ps8s62b5e19nrr67wqw9u'",
      {
        timeout: 6000
      }
    );
  }
  if (msg.type === "image") {
    const selection = figma.currentPage.selection;

    const fillMap = (
      node: RectangleNode | PolygonNode | EllipseNode | VectorNode
    ) => {
      if (msg.options) {
        node.setPluginData(optionsKey, JSON.stringify(msg.options));
      }

      let image = figma.createImage(msg.image);

      node.fills = [
        {
          type: "IMAGE",
          imageHash: image.hash,
          scaleMode: "FILL"
        }
      ];

      return node;
    };

    // Fill all selected fillable node
    selection.forEach(node => {
      if (
        node.type === "RECTANGLE" ||
        node.type === "POLYGON" ||
        node.type === "ELLIPSE" ||
        node.type === "VECTOR"
      ) {
        fillMap(node);
      }
    });
    figma.ui.postMessage({
      type: "map-drawed",
      message: `Map drawed in Figma`
    });
    // Create a Rectangle id there is no selected node. or one node which is a frame
    if (selection.length === 0) {
      const node = fillMap(figma.createRectangle());
      const { x, y } = figma.viewport.center;
      node.x = x;
      node.y = y;
      node.resize(msg.width, msg.height);
      figma.currentPage.selection = [node];
      figma.currentPage.appendChild(node);
      figma.viewport.scrollAndZoomIntoView([node]); // Apply scrollAndZoomIntoView
    }

    // Create Map if 1 frame is selected
    if (selection.length === 1 && selection[0].type === "FRAME") {
      const frame = selection[0];
      if (frame.type === "FRAME") {
        const node = fillMap(figma.createRectangle());
        figma.currentPage.selection = [node];
        node.resize(msg.width, msg.height);
        frame.appendChild(node);
        figma.viewport.scrollAndZoomIntoView([node]); // Apply scrollAndZoomIntoView
      }
    }
    figma.closePlugin();
  }
};
