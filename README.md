# View GeoJSON Data Package

This is a practical usecase for a package for GeoView that allows the user to load GeoJSON data to the map and then preview it's properties on a panel when a user clicks on a feature on the map.

## Building the package

The package was created using React. To build it you first need to clone this repo

### Clone the repo

```
git clone https://github.com/yass0016/view-geojson-data.git
```

### Install dependencies

```
cd view-geojson-data
npm install
```

### Build package

```
npm run build
```

After the package is built, you should see a new folder called `build`, inside you will find the package bundle script.

```
build/static/js/main*.js
```

## Using the package

To use this package on a GeoView project, you need to import it in a script tag on your HTML file. Then in the map config of GeoView you need to tell GeoView that you want to load this package by adding it under `externalPackages`.

```json
{
  "map": {
    "interaction": "dynamic",
    "view": {
      "zoom": 12,
      "center": [-100, 60],
      "projection": 3978
    },
    "basemapOptions": {
      "id": "transport",
      "shaded": true,
      "labeled": true
    },
    "layers": []
  },
  "theme": "dark",
  "components": ["appbar", "navbar", "north-arrow", "overview-map"],
  "corePackages": [],
  "externalPackages": [
    {
      "name": "view-geojson-data",
      "configUrl": "./view-geojson-data-config.json"
    }
  ],
  "languages": ["en-CA", "fr-CA"],
  "version": "1.0"
}
```
