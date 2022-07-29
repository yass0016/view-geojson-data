import "./style.css";

import schema from "./schema.json";
import defaultConfig from "./default-config-view-geojson-data.json";

import { PanelContent } from "./PanelContent";

// get instance of window
const w = window;

/**
 * Create a class for the plugin instance
 */
class ViewGeoJSONData {
  // store the created button panel object
  buttonPanel = null;

  /**
   * Return the package schema, its important to return the schema so that the
   * core can validate the plugin configuration
   *
   * @returns the package schema
   */
  schema = () => schema;

  /**
   * Return the default config for this package, its important to return the default
   * config so that if no config is provided, the plugin will be configured with the
   * default config
   *
   * @returns the default config
   */
  defaultConfig = () => defaultConfig;

  /**
   * translations object to inject to the viewer translations
   *
   * @optional
   */
  translations = {
    "en-CA": {
      viewGeoJSONDataPanel: "View GeoJSON Data",
    },
    "fr-CA": {
      viewGeoJSONDataPanel: "Afficher les données GeoJSON",
    },
  };

  /**
   * Display a tooltip when the mouse is over a feature
   *
   * @param {MouseEvent} e a mouse event when the mouse is over the map
   */
  displayDetails(e) {
    // get the pixel position of the mouse
    const pixel = e.pixel;

    // get the OL map
    const map = e.map;

    // get the features at the mouse position
    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    });

    // get the tooltip container
    const tooltipContainer = map
      .getTargetElement()
      .getElementsByClassName("tooltip");

    // if the container is available
    if (tooltipContainer && tooltipContainer.length > 0) {
      // if no feature is found, hide the tooltip
      tooltipContainer[0].style.display = "none";
      tooltipContainer[0].innerHTML = "";

      // if a feature is found, display the tooltip
      if (feature) {
        tooltipContainer[0].style.display = "block";
        tooltipContainer[0].style.top = pixel[1] + "px";
        tooltipContainer[0].style.left = pixel[0] + "px";

        // get the properties of the feature
        const properties = feature.getProperties();

        // remove geometry property
        delete properties.geometry;

        // display the properties in the tooltip
        Object.keys(properties).forEach((property, index) => {
          // create a row for the property
          const value = document.createElement("div");

          // set the value of the property
          value.innerHTML = `<strong>${property}:</strong> ${properties[property]}`;

          // set the class name
          value.className = "tooltip-value";

          // if the index is even, set the background color to dark
          value.style.backgroundColor = index % 2 === 0 ? "#f2f2f2" : "#fff";

          // append the value to the tooltip
          tooltipContainer[0].innerHTML += value.outerHTML;
        });
      }
    }
  }

  /**
   * Create a tooltip container that will show the feature details
   */
  createTooltipContainer() {
    const { props } = this;

    // access the cgpv object from the window object
    const { cgpv } = w;

    const { mapId } = props;

    const { api } = cgpv;

    const map = api.map(mapId).map;

    const mapContainer = map.getTargetElement();

    // create a tooltip container
    const tooltip = document.createElement("div");

    // set the class name
    tooltip.className = "tooltip";

    // append the tooltip to the map container
    if (mapContainer) {
      mapContainer.append(tooltip);
    }
  }

  async loadGeoJsonDataOnMap() {
    const { configObj, props } = this;

    const { mapId } = props;

    // access the cgpv object from the window object
    const { cgpv } = w;

    const { api } = cgpv;

    api.map(mapId).layer.addLayer({
      id: "viewGeoJsonDataLyer",
      name: {
        en: "GeoJSON Data",
        fr: "Données GeoJSON",
      },
      url: {
        en: configObj.geoJsonPath,
        fr: configObj.geoJsonPath,
      },
      layerType: "geojson",
    });
  }

  /**
   * Added function called after the plugin has been initialized
   */
  added = () => {
    const { configObj, props } = this;

    const { mapId } = props;

    // access the cgpv object from the window object
    const { cgpv } = w;

    if (cgpv) {
      // access the api calls
      const { api, ui } = cgpv;
      const { DetailsIcon } = ui.elements;
      const { language } = api.map(mapId);

      this.loadGeoJsonDataOnMap();

      if (configObj?.enablePanel) {
        // button props
        const button = {
          id: "viewGeoJsonDataPanelButton",
          tooltip: this.translations[language].viewGeoJSONDataPanel,
          tooltipPlacement: "right",
          children: <DetailsIcon />,
          visible: true,
        };

        // panel props
        const panel = {
          title: this.translations[language].viewGeoJSONDataPanel,
          icon: <DetailsIcon />,
          width: 200,
          status: configObj?.isOpen,
        };

        // create a new button panel on the appbar
        this.buttonPanel = api
          .map(mapId)
          .appBarButtons.createAppbarPanel(button, panel, null);

        // set panel content
        this.buttonPanel?.panel?.changeContent(
          <PanelContent panel={this.buttonPanel?.panel} mapId={mapId} />
        );
      }

      // if the tooltip is enabled, listen to the map mousemove event
      if (configObj.enableTooltip) {
        // get OL map
        const map = api.map(mapId).map;

        // create a tooltip container
        this.createTooltipContainer();

        // listen to map mousemove event
        map.on("pointermove", this.displayDetails);
      }
    }
  };

  /**
   * Function called when the plugin is removed, used for clean up
   */
  removed = () => {
    const { configObj } = this;

    const { mapId } = this.pluginProps;

    // access the cgpv object from the window object
    const { cgpv } = w;

    if (cgpv) {
      // access the api calls
      const { api } = cgpv;

      // if panel has been created then remove it
      if (this.buttonPanel) {
        api.map(mapId).appBarButtons.removeAppbarPanel(this.buttonPanel.id);
      }

      // if the tooltip is enabled, remove the mousemove event
      if (configObj.enableTooltip) {
        const map = api.map(mapId).map;

        // unlisten to map mousemove event
        map.un("pointermove", this.displayDetails);
      }
    }
  };
}

export default ViewGeoJSONData;

w["plugins"] = w["plugins"] || {};
w["plugins"]["view-geojson-data"] = ViewGeoJSONData;
