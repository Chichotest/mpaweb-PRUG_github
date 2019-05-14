(function (window) {
    'use strict';

    function initMap() {
        
        //var control;
        var L = window.L;
        var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //attribution: 'Map data &copy; 2013 OpenStreetMap contributors'
            attribution: 'Colaboradores de &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        });

        var zonasprug = L.tileLayer.wms(
            //"http://www.idecyl.jcyl.es/geoserver/am/wms",
            "https://idecyl.jcyl.es/geoserver/am/wms",
            //Con leaflet 0.7.7 la calse es tileLayer.wms y el fromato de los servidores distinto
            //"http://www.idecyl.jcyl.es/geoserver/am/wms",
            //"AM.pn_cyl_sg_zonif_s",
            {
              //attribution: 'IDECYL. Junta de Castilla-León',
              attribution: 'Cartografía P.R.U.G. a partir de &copy <a href="http://www.idecyl.jcyl.es/geonetwork/srv/spa/catalog.search#/home">IDECYL Junta de Castilla y León</a> ',
              //layers: "AM.pn_cyl_sg_zonif_s",
              layers: "PRUG_PN_S_Guadarrama",
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
              //attribution: "Topográfico ráster, cedido por © Instituto Geográfico Nacional de España",
              attribution: 'Topográfico ráster cedido por &copy <a href="http://www.ign.es"> Instituto Geográfico Nacional de España</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
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
              //attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España",
             attribution: 'Ortofoto cedida por &copy <a href="http://www.ign.es"> Instituto Geográfico Nacional de España</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
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

        //CAPA DE MONTES DE UTILIDAD PUBLICA CAM
        //var overlay_Montesdeutilidadpblica_0 = L.WMS.layer("https://idem.madrid.org/geoidem/Zonas/SIGI_MA_MONTES_UP/wms?request=GetCapabilities", "SIGI_MA_MONTES_UP", {
            var overlay_Montesdeutilidadpblica_0 = L.tileLayer.wms(
            "https://idem.madrid.org/geoidem/Zonas/SIGI_MA_MONTES_UP/wms?",
            {
            layers: "SIGI_MA_MONTES_UP",
            format: 'image/png',
            uppercase: true,
            transparent: true,
            continuousWorld : true,
            tiled: true,
            info_format: 'text/html',
            opacity: 1,
            identify: false,
        });
        //

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
            //layers: [osm, zonasprug, capa_senderos, topoign, overlay_Montesdeutilidadpblica_0]             
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
        //Añadir boton de pantalla completa
        //map.addControl(new L.Control.Fullscreen());
        //map.addControl(new L.Control.Fullscreen({
        //    title: {
        //        'false': 'Vista a pantalla completa',
        //        'true': 'Salir de pantalla compelta'
        //    }
        //}));
        ///
        
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
            //"Montes de Utilidad Pública de la C.A.M.": overlay_Montesdeutilidadpblica_0
        }
        L.control.layers(baseLayers, overlays).addTo(map);
    }

    window.addEventListener('load', function () {
        initMap();
    });
}(window));
