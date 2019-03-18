import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Post} from "../../models/Post";
import {HomePage} from "../home/home";
import {Camera} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {AngularFireStorage} from "angularfire2/storage";
import {PlacesProvider} from "../../providers/places/places";

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  private previewImage: string = "";
  public postCollection: AngularFirestoreCollection<Post>;
  public postText: string = "";
  public bookAuthor: string = "";
  public bookCondition: string = "";
  public coordinationText: string = "";
  public author: string = "";
  public date: string;
  public authorEmail: string;
  public price: string;
  public lat: number;
  public lng: number;
  public count: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private angularFire: AngularFirestore,
              private angularFireStorage: AngularFireStorage,
              private placesProvider: PlacesProvider,
              private toastController: ToastController,
              private angularFireStore: AngularFirestore
  ) {
    this.postCollection = navParams.get("postCollection");
  }

  addPost() {
    // Attempt to add date to file name
    //miliseconds added because images need unique id,
    // and if you took images at the same date, you would override them
    let nowDate = new Date();
    let secondDate = new Date().getMilliseconds();

    this.date = nowDate.getDate() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getFullYear();

    let imageFileName = `${this.angularFire.app.auth().currentUser.email}_${this.date + secondDate}.png`;

    let task = this.angularFireStorage.ref(imageFileName).putString(this.previewImage, "base64", {contentType: "image/png"});

    //We need both the username and the email, so I separated them

    this.author = this.angularFire.app.auth().currentUser.email.split("@")[0];

    this.authorEmail = this.angularFire.app.auth().currentUser.email;

    this.findGeolocation();

    let uploadEvent = task.downloadURL();

    if (this.postText != null &&
      this.bookAuthor != null &&
      this.price != null &&
      this.bookCondition != null) {
      uploadEvent.subscribe((uploadImageURL) => {
        this.postCollection.add(
          {
            body: this.postText,
            bookAuthor: this.bookAuthor,
            price: this.price,
            author: this.author,
            email: this.authorEmail,
            location: this.coordinationText,
            bookCondition: this.bookCondition,
            date: this.date,
            lat: this.lat,
            lng: this.lng,
            imageURL: uploadImageURL
          } as Post);
      });
      this.count++;
      this.navCtrl.push(HomePage);
    }
    else {
      this.showInputErrorMessage();
    }
  }

  showInputErrorMessage() {
    let toast = this.toastController.create({
      message: "Please fill out all fields",
      duration: 2500,
      position: "bottom",
      //Attempted to style the css class
      // cssClass: "toast"
    });
    toast.present();
  }

  logOut() {
    this.angularFireStore.app.auth().signOut();
  }

  //Opens the camera app and lets the user see a preview before posting
  openCamera() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      correctOrientation: true
    }).then(imgBase64 => {
      this.previewImage = imgBase64;
    });
  }

  //call function to find the current position and return lat and lng,
  // as well as a readable address
  findGeolocation() {
    this.location.getCurrentPosition().then((pos) => {
      this.placesProvider.getAddressBasedOnLatLng(
        pos.coords.latitude,
        pos.coords.longitude
      ).then((place: any) => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.coordinationText = place.results[1].formatted_address;
      }).catch((error) => {
        console.error(error);
      });
    })
  }
}
