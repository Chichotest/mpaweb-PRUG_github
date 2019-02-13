(function (window) {
    'use strict';

    function initMap() {
        
        //var control;
        var L = window.L;
        var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; 2013 OpenStreetMap contributors'
        });

        var zonasprug = L.tileLayer.wms(
            "http://www.idecyl.jcyl.es/geoserver/am/wms",
            //Con leaflet 0.7.7 la calse es tileLayer.wms y el fromato de los servidores distinto
            //"http://www.idecyl.jcyl.es/geoserver/am/wms",
            //"AM.pn_cyl_sg_zonif_s",
            {
              attribution: 'IDECYL. Junta de Castilla-León',
              layers: "AM.pn_cyl_sg_zonif_s",
              format: "image/png",
              uppercase: true,
              transparent: true,
              continuousWorld: true,
              tiled: true,
              info_format: "text/html",
              opacity: 1,
              identify: false
            }
          );
        
        var topoign = L.tileLayer.wms(
            //WMS.layer es para versiones mas modernas de leaflet
            //var topoign = L.WMS.layer(
            "http://www.ign.es/wms-inspire/mapa-raster?",
            //"mtn_rasterizado",
            {
              attribution: "Topográfico ráster. Cedido por © Instituto Geográfico Nacional de España",
              layers: "mtn_rasterizado",
              format: "image/png",
              uppercase: true,
              transparent: true,
              continuousWorld: true,
              tiled: true,
              info_format: "text/html",
              opacity: 1,
              identify: false
            }
          );
      
          var pnoa = L.tileLayer.wms(
            "http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&",
            {
              layers: "OI.OrthoimageCoverage", //nombre de la capa (ver get capabilities)
              format: "image/png",
              //transparent: true,
              //version: "1.3.0", //wms version (ver get capabilities)
              attribution:
                "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España",
              //opacity: 0.5,
              uppercase: true,
              transparent: true,
              continuousWorld: true,
              tiled: true,
              info_format: "text/html",
              opacity: 1,
              identify: false   
            }
          );

        //CAPA SENDEROS BICICLETA A PARTIR DEL FICHERO senderos.js
        function estilo(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'blue',
                //dashArray: '3'                

            };
        }; 
        var capa_senderos = L.geoJson(senderos, {
        //L.geoJson(senderos, {
            style: estilo
        });   
        //}).addTo(map);
        ////////////// 


        var map = L.map('map', {
            //center: [0, 0],
            //zoom: 2,
            zoomControl:true, maxZoom:20, minZoom:11,
            layers: [osm, zonasprug, capa_senderos, topoign]
        }).fitBounds([[40.6833316952,-4.18432124864],[41.0686841156,-3.65726153255]]);
    
        var style = {
            color: 'red',
            opacity: 1.0,
            fillOpacity: 1.0,
            weight: 2,
            dashArray: '3',                
            clickable: false
        };
        L.Control.FileLayerLoad.LABEL = '<img class="icon" src="folder.svg" alt="file icon"/>';
        var control = L.Control.fileLayerLoad({
            fitBounds: true,
            layerOptions: {
                style: style,
                pointToLayer: function (data, latlng) {
                    return L.circleMarker(
                        latlng,
                        { style: style }
                    );
                }
            }
        });
        control.addTo(map);
        control.loader.on('data:loaded', function (e) {
            var layer = e.layer;
            console.log(layer);
        });
        

        //selector de capas
        var baseLayers = {
            "Open Street map": osm,   
            "Fotografía aérea PNOA": pnoa         
        };
        var overlays = {
            "Topográfico IGN": topoign,
            "Zonificación PRUG ": zonasprug,
            //"Fotografía aérea PNOA": pnoa
            "Vías autorizadas para bicicletas (en azul)": capa_senderos,
            //"Fichero subido": layer
        }
        L.control.layers(baseLayers, overlays).addTo(map);
    }

    window.addEventListener('load', function () {
        initMap();
    });
}(window));
