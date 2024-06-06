import React from "react";
import { ButtonGroup, ButtonToolbar, Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";
import { fromLonLat } from "ol/proj";
import { Draw, Snap } from "ol/interaction";
import GeoJSON from 'ol/format/GeoJSON'
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import { getCenter } from "ol/extent";
import AssetRequest from './AssetRequest'
import Header from './Header'

class MapContentPage extends React.Component {
    constructor() {
        super();
        this.state = {
            city: "",
        }
        this.map = null;
        this.snap = null;
        this.draw = null;
        this.modify = null;
        this.vecSource = null;
        this.onKey = this.onKey.bind(this);
        this.addInteractions = this.addInteractions.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.zoomToAllLocations = this.zoomToAllLocations.bind(this);
    }
    onKey(e) {
        if (e.key === 'Enter') {
            this.onSearch()
        }
    }
    onChangeCity(e) {
        this.setState({ city: e.target.value })
    }
    onSearch() {
        let mySelf = this;
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.state.city}&limit=5&appid=f49a8482fb022d5b4165e3c55c6d9e37`
        AssetRequest.getJson(url, false, function (res) {
            if (!res) {
                return;
            }
            if (res.length == 0) {
                return;
            }
            console.log(mySelf.map.getView().getCenter())
            let crd = fromLonLat([res[0].lon, res[0].lat], "EPSG:3857")
            mySelf.map.getView().animate({ zoom: 13 }, { center: crd })
        })
    }
    addInteractions(typ) {
        this.vecSource.clear();
        this.draw = new Draw({
            source: this.vecSource,
            type: typ,
        });
        let mySelf = this;
        this.draw.on("drawend", function (evt) {
            //let geom = evt.feature.getGeometry();
            // console.log(geom)

            let geom = new GeoJSON().writeFeature(evt.feature)
            mySelf.props.afterLocationDraw(geom)
        })
        this.map.addInteraction(this.draw);
        this.snap = new Snap({ source: this.vecSource });
        this.map.addInteraction(this.snap);
    }
    render() {
        let mapHeight = 100 + "vh";
        return (

            
            <div>
                <Header />
                <ButtonToolbar
                    className="justify-content-between"
                    aria-label="Toolbar with Button groups" >
                    <InputGroup style={{ margin: '2px' }} >
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={this.state.city}
                            onChange={this.onChangeCity}
                            onKeyDown={this.onKey}
                            aria-label="Input group example"
                            aria-describedby="btnGroupAddon2"

                        />
                        <InputGroup.Text id="btnGroupAddon2"> <BsSearch onClick={this.onSearch} /> </InputGroup.Text>
                    </InputGroup>
                </ButtonToolbar>

                <div id="mapDiv" className='map' style={{ height: mapHeight }}>
                    <div className='icondiv'>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        //  AssetSystem.MapEngine.createMap("mapDiv");
        //  AssetSystem.MapEngine.addOSMLayer(null);

        const raster = new TileLayer({
            source: new OSM(),
        });

        this.vecSource = new VectorSource();
        const vector = new VectorLayer({
            source: this.vecSource,
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.2)',
                'stroke-color': 'red',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#ffcc33',
            },
        });

        this.map = new Map({
            layers: [raster, vector],
            target: 'mapDiv',
            view: new View({
                center: [-11000000, 4600000],
                zoom: 4,
            }),
        });

    }

    addAllLocations() {
        for (let i = 0; i < this.props.locations.length; i++) {
            let feature = new GeoJSON().readFeature(this.props.locations[i].geometry)
            console.log(feature)
            this.vecSource.addFeature(feature)
        }
        this.zoomToAllLocations();
    }

    zoomToAllLocations() {
        let ext = this.vecSource.getExtent();
        let center = getCenter(ext);
        this.map.getView().animate({ zoom: 2 }, { center: center });
    }
}
export default MapContentPage;



// import React from 'react';
// import GoogleMapReact from 'google-map-react';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

// const Map = ({ center, zoom }) => {
//   return (
//     <div>
//       <input type="search" />
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: '60vh', width: '60vw' }}>

//         <GoogleMapReact
//           bootstrapURLKeys={{ key: 'AIzaSyDDICEQQNIQl6wuNvSMZGetaq2qgTHe3zI' }}
//           defaultCenter={center}
//           defaultZoom={zoom}
          
//         >
//           <AnyReactComponent
//             lat={center.lat}
//             lng={center.lng}
//             text="My Marker"
//           />
//         </GoogleMapReact>
//       </div>
//     </div>
//   );
// };

// export default Map;
