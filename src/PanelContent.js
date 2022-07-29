export function PanelContent(props) {
  const { panel, mapId } = props;

  const { cgpv } = window;

  const { react, api, ui } = cgpv;

  const { ArrowBackIcon } = ui.elements;

  const { useEffect, useState } = react;

  const [features, setFeatures] = useState([]);
  const [properties, setProperties] = useState({});
  const [isList, setIsList] = useState(false);

  function mapClick(e) {
    const map = e.map;

    const features = map.getFeaturesAtPixel(e.pixel);

    setFeatures(features);
    setIsList(true);

    panel.open();
  }

  useEffect(() => {
    const map = api.map(mapId).map;

    // listen to map click event
    map.on("click", mapClick);

    return () => {
      // unlisten to map click event
      map.un("click", mapClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function backToList() {
    panel.removeActionButton("backButton");

    setProperties({});
    setIsList(true);
  }

  function displayDetailsOnPanel(e, feature) {
    const properties = feature.getProperties();

    // remove geometry property
    delete properties.geometry;

    setIsList(false);
    setProperties(properties);

    panel.addActionButton("backButton", "Back", <ArrowBackIcon />, backToList);
  }

  return (
    <div>
      {isList
        ? features.map((feature) => {
            return (
              <div
                onClick={(e) => displayDetailsOnPanel(e, feature)}
                key={feature.ol_uid}
                className="feature-list-item"
              >
                <div className="feature-list-item-value">{feature.ol_uid}</div>
              </div>
            );
          })
        : Object.keys(properties).map((property, index) => {
            return (
              <div
                className="tooltip-value"
                key={property}
                style={{
                  backgroundColor: index % 2 === 0 ? "#202020" : "#000",
                  whiteSpace: "normal",
                  height: "auto",
                }}
              >
                <strong>{property}:</strong> {properties[property]}
              </div>
            );
          })}
    </div>
  );
}
