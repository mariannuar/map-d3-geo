# Building a Map Component using the module d3-geo from the D3.js library

This repository shows and explains though a simple example of how to build a map in a site using some modules from the D3.js library that is used for Data Visualizations.

## Table of Contents

1. What is D3.js
2. Working with this project
3. Using and explaning the project and how to use the d3 module to build maps.

## What is D3.js

It's a Javascript library created by Mike Bostock that is used to visualize complex data with Web Standards. This means, D3 uses existing standards such HTML, CSS and SVG to visualize this data.

D3 has modules to visualize data in different ways, in this example we are using the D3 Geo module, that is used to represent maps as svg (or canvas).

## Working with this project.

To work with this project, first you'll need to have a version of `Node >= 14`. Then run `npm install` to install all of the dependencies.

To run the project just use this command `npm run start`.

This will open you a window in your browser, that will display the following map:

![Screenshot](./static/screenshot-map.png)

## Using and explaning the project and how to use the d3 module to build maps.

### D3-geo
As it was mentioned before, we are using the d3-geo module. To use it in any project, you just have to install it.

If you are using npm, run `npm install d3-geo`, or if you are using yarn, run `yarn add d3-geo`.

Then, you will have to import it in your js file:

```
  import { geoAlbersUsa, geoPath } from "d3-geo";
```

The `geoPath` is a geographic path generator, similar to the shape generators in [d3-shape](https://github.com/d3/d3-shape): it generates an SVG path data by giving a GeoJSON geometry or feature object. 

This creates a new geographic path generator with the default settings. You can specified the projection, so this sets the current projection to the specified projection you want. If there isn't a projection specified, it will use the current one which for default returns null. It represents the identity transformation: the input geometry is not projected and is instead rendered directly in raw coordinates.

That's why we imported the `geoPath` because for this example we want to use the `geoAlbersUsa` as the projection.


Projections transform spherical polygonal geometry to planar polygonal geometry. D3 provides implementations of several classes of standard projections:

- [Azimuthal Projections](https://github.com/d3/d3-geo#azimuthal-projections)
- [Composite Projections](https://github.com/d3/d3-geo#composite-projections)
- [Conic Projections](https://github.com/d3/d3-geo#conic-projections)
- [Cylindrical Projections](https://github.com/d3/d3-geo#cylindrical-projections)

For this example, we are using `Composite Projections`, which consist in several projections into a single display. It has fixed clip, center and rotation, so this means, it doesn't suppor projection.clipAngle, projection.clipExtend, projection.rotate and projection.center. 

That's why we imported the [geoAlbersUsa](https://github.com/d3/d3-geo#geoAlbersUsa), which is a combination of three [d3.geoConicEqualArea](https://github.com/d3/d3-geo#geoConicEqualArea). In this projection, for the lower forty eight states it uses the `d3.geoAlbers` and for Alaska and Hawai it uses separate conic equal-area.

In the code, we define a variable for the projection and the path. In the following way we define the `geoAlberUsa` as the projection of our map:

```
const projection = geoAlbersUsa();

const path = geoPath().projection(projection);
```

### D3-fetch
Now, we will need another module from `D3 js` besides the `d3-geo`, and that's [d3-fetch](https://github.com/d3/d3-fetch). This module allows us to fetch data from any kind of file. This module has built-in support for parsing JSON, CSV, and TSV.

To install it, if you are using npm you have to run `npm install d3-fetch`, and if you are using yarn, `yarn add d3-fetch`.

To use it for this example, we do it in the following way

```
const geojsonApiUrl = json(`../static/states-10m.json`);
```

The `states-10m.json` is a TopoJSON file that includes the coordinates of our States Map. This file is important because it will tell to d3 all the data needed to build the map. [TopoJSON](https://github.com/topojson/topojson) is an extension of GeoJSON that encodes topology. Rather than representing geometries discretely, geometries in TopoJSON files are stitched together from shared line segments called arcs. The use of this in this example will be explain a little bit more below.

### D3-Selection
This is another module from `D3 js` that we will need, and that is [d3-selection](https://github.com/d3/d3-selection). This module allows us to set attributes, styles, properties, HTML or text content, and more. Using the data join’s enter and exit selections, you can also add or remove elements to correspond to data.

To install it, if you are using npm you have to run `npm install d3-selection`, and if you are using yarn, `yarn add d3-selection`.


Then, you will have to import it in your js file:

```
import { selection } from d3-selection;
```