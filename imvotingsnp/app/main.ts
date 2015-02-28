/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../typings/google.maps.d.ts" />
module Snp {

    google.maps.event.addDomListener(window, 'load', () => {
        var main = new Main("map");
    });

    export class Main {

        form: JQuery;

        constructor(mapCanvasId: string) {
            this.init(mapCanvasId);
            this.hookUpForm();
        }

        init(mapCanvasId: string) {
            var mapOptions: google.maps.MapOptions = {
                center: new google.maps.LatLng(56.490671, -4.202646),
                zoom: 8,
                styles: [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }]
            };

            var map = new google.maps.Map(document.getElementById(mapCanvasId),
                mapOptions);

            google.maps.event.addListenerOnce(map, 'idle', () => {
                document.body.classList.add("loaded");
            });

            this.form = $("form", "#content");

            var input = <HTMLInputElement>document.getElementById("address");
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });

            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                marker.setVisible(false);
                infowindow.close();

                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);  // Why 17? Because it looks good.
                }

                marker.setIcon(/** @type {google.maps.Icon} */({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));

                var circleOptions = {
                    strokeColor: '#FFF95D',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: '#FFF95D',
                    fillOpacity: 0.55,
                    map: map,
                    center: place.geometry.location,
                    radius: 30
                };

                var circle = new google.maps.Circle(circleOptions);
                circle.setVisible(true);

                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }

                var html = '<form style="width: 300px;"><div class="form-group"><label for="submitEmail">Email address</label >' +
                    '<input type="email" class="form-control" id="submitEmail" placeholder="Add your email address to get updates">' +
                    '</div ><button type="submit" class="btn btn-default">I\'m voting SNP!</button></form>';

                infowindow.setContent(html);
                infowindow.open(map, marker);

                google.maps.event.addListener(infowindow, 'closeclick', () => {
                    input.value = "";
                    this.form.addClass("active");
                });
            });

            this.handleWindowResize();
            window.addEventListener("resize", () => {
                this.handleWindowResize();
            });
        }

        handleWindowResize() {
            this.onResize(document.body.clientHeight);
        }

        onResize(newWindowHeight: number) {
            var formHeight = this.form.outerHeight();
            this.form.css({ top: (newWindowHeight - formHeight) / 2 });
        }

        hookUpForm() {
            this.form.on("submit", (e) => {
                e.preventDefault();
                this.form.removeClass("active");
            });

            this.form.addClass("active");
        }
    }
 }