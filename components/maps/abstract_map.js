import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

import StateGeoJSON from '../../assets/tn_geojson.json'
import CountyGeoJSON from '../../assets/county_geojson.json'

import MapboxToken from '../../token.json';

const Map = createPlotComponent(plotly);

class AbstractMap extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      stateZoom: 6.35,
      countyZoom: 6.2
    }
  }

  componentDidMount() {
    this.updateZoomLevels(window.innerWidth)
  }

  updateZoomLevels(width) {
    this.setState({
      stateZoom: this.stateZoom(width),
      countyZoom: this.countyZoom(width)
    });
  }

  stateZoom(width) {
    return ((0.001144 * width) + 4.42797);
  }

  countyZoom(width) {
    return ((0.0012712 * width) + 4.0644);
  }

  mamObject() {
    switch(this.props.mObj.type) {
      case "smap":
        return this.stateMap(this.props.mObj);
      case "cmap":
        return this.countyMap(this.props.mObj);
    }
  }

  stateMap(mObj) {
    let hov_temp = '<br>' + mObj.hovtext + ' %{z}<extra></extra>'

    let data = [{
      type: "choroplethmapbox",
      geojson: StateGeoJSON,
      locations: ["Tennessee"],
      z: [mObj.z],
      featureidkey: "properties.NAME",
      colorscale: [
        ['0.0', 'rgb(255, 255, 255)'],
        ['1.0', mObj.col]
      ],
      hovertemplate:
        '<b>%{location}</b>' +
        hov_temp,
      marker: {
         opacity: 0.75
       },
      showscale: false
    }];

    let layout = {
      mapbox: {
        style: "light",
        zoom: this.state.stateZoom,
        center: {
          lat: 35.8,
          lon: -86
        }
      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 2
      },
      autosize: true
    }

    return {
      data: data,
      layout: layout
    }
  }

  countyMap(mObj) {
    let hov_temp = '<br>' + mObj.hovtext + ' %{z}<extra></extra>'

    let data = [{
      type: "choroplethmapbox",
      geojson: CountyGeoJSON,
      locations: mObj.counties,
      z: mObj.z,
      featureidkey: "properties.NAME",
      colorscale: [
        ['0', mObj.col1],
        ['0.01', mObj.col2],
        ['0.33', mObj.col3],
        ['0.66', mObj.col4],
        ['1.0', mObj.col5]
      ],
      zmin: 0,
      zmax: Math.max(...mObj.z),
      hovertemplate:
        '<b>%{location}</b>' +
        hov_temp,
      marker: {
         opacity: 0.75
       }
    }];

    let layout = {
      mapbox: {
        style: "light",
        zoom: this.state.countyZoom,
        center: {
          lat: 35.8,
          lon: -86
        }
      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 2
      },
      autosize: true
    }

    return {
      data: data,
      layout: layout
    }
  }

  render() {
    let mObj = this.mamObject(this.props.mObj);

    return(
      <Map
        data={mObj.data}
        layout={mObj.layout}
        config={{
          displayLogo: false,
          responsive: false,
          mapboxAccessToken: MapboxToken.token,
          toImageButtonOptions: {
            format: 'png',
            filename: 'plot',
            height: 900,
            width: 1500,
            scale: 2
          },
        }}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
        onClick={this.props.onClick}
      />
    );
  }
}

export default AbstractMap;