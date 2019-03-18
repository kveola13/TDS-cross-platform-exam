// import {ElementRef, Injectable, ViewChild} from "@angular/core";
// import {Geolocation} from "@ionic-native/geolocation";
// import {PlacesProvider} from "../places/places";
//
// declare var google;
//
// @Injectable()
// export class MarkersProvider{
//
//   @ViewChild('map') mapElement: ElementRef;
//   map: any;
//
//   constructor(public location: Geolocation, public placesProvider: PlacesProvider){
//
//   }
//
//   addMarker(map: any, coords: String, book: String, author: String, price: String, bookCondition: String) {
//     this.location.getCurrentPosition().then((pos) => {
//       this.placesProvider.getAddressBasedOnLatLng(
//         pos.coords.latitude,
//         pos.coords.longitude
//       ).then((place: any) => {
//         coords = place.results[1];
//       }).catch((error) => {
//         console.error(error);
//       });
//       let marker = new google.maps.Marker({
//         map: this.map,
//         animation: google.maps.Animation.BOUNCE,
//         position: map.getCenter()
//       });
//
//       let content = "<h1>" + book + "</h1>" +
//         "<h2> " + author + "</h2>" +
//         "<h3> " + price + "</h3>" +
//         "<h4>" + bookCondition + "</h4>";
//       this.addMarkerInfo(marker, content);
//     })
//   }
//
//   addMarkerInfo(marker, content) {
//     let markerInfo = new google.maps.InfoWindow({
//       content: content
//     });
//
//     google.maps.event.addListener(marker, 'click', () => {
//       markerInfo.open(this.map, marker);
//     });
//   }
// }
