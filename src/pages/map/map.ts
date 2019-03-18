import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {Post} from "../../models/Post";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public collection: AngularFirestoreCollection<Post>;
  public posts: Observable<Post[]>;

  //I make an array of all the queries that
  //I subscribe to, so that I can fetch the information
  //that I want, and put it inside of a marker.
  public postText: String[] = [];
  public bookAuthor: String[] = [];
  public bookCondition: String[] = [];
  public author: String[] = [];
  public date: String[] = [];
  public authorEmail: String[] = [];
  public price: String[] = [];
  public lat: number[] = [];
  public lng: number[] = [];
  public bookLocation: String[] = [];
  count: number = 0;

  @ViewChild('map') mapElement: ElementRef;
  map: any;


  constructor(
    public navCtrl: NavController,
    public location: Geolocation,
    public angularFireStore: AngularFirestore) {
    this.collection = this.angularFireStore.collection<any>("posts");
    this.collection.snapshotChanges().map(actions => {
      return actions.map(action => {
        let data = action.payload.doc.data() as Post;
        let id = action.payload.doc.id;

        return {
          id,
          ...data,
        };
      })
    }).subscribe(query => {
      query.forEach((doc) => {
          this.postText[this.count] = doc.body;
          this.bookAuthor[this.count] = doc.bookAuthor;
          this.bookCondition[this.count] = doc.bookCondition;
          this.author[this.count] = doc.author;
          this.authorEmail[this.count] = doc.email;
          this.price[this.count] = doc.price;
          this.location[this.count] = doc.location;
          this.lat [this.count] = doc.lat;
          this.lng [this.count] = doc.lng;
          this.bookLocation[this.count] = doc.location;
          this.count++;
        }
      )
    });
  }

// For once, this method is called, so I need it.
//  Deleting this method deletes the map
  ionViewDidLoad() {
    this.loadMap();
  }

  //loads a hybrid map from google, with the 16 zoom
  //I tried different zooms but it was the most fitting.
  loadMap() {
    this.location.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: "hybrid"
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let i: number;
      //Adds a marker for every item in the arrays, with information.
      for (i = 0; i < this.count; i++) {
        this.addMarker(this.lat[i],
          this.lng[i],
          this.postText[i],
          this.bookAuthor[i],
          this.price[i],
          this.author[i],
          this.authorEmail[i],
          this.bookCondition[i]
          , this.location [i]
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  //When adding the marker it needs information about the post
  addMarker(lat: number,
            lng: number,
            title: String,
            bookAuthor: String,
            price: String,
            author: String,
            email: String,
            bookCondition: String,
            bookLocation: String) {
    let pos = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: pos
    });
    //content displays the information that's taken in from the method.
    let content = "<h4>" + title.toUpperCase() + "</h4>" +
      "<h5>By: " + bookAuthor + "</h5>" +
      "<h5>Price: " + price + "$</h5>" +
      "<p>Seller: " + author + "</p>" +
      "<p>Email: " + email + "</p>" +
      "<p>Condition: " + bookCondition + "</p>"
    + "<p>" + bookLocation + "</p>"
    ;
    this.addToMarker(marker, content);
  }

  //add the information to the marker
  addToMarker(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    //Click listener for when you click on the marker, it displays the info
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  goToAddPostPage() {
    this.navCtrl.push("AddPostPage", {
      postCollection: this.collection
    });
  }

  logOut() {
    this.angularFireStore.app.auth().signOut();
  }
}
