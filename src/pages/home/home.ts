import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Post} from "../../models/Post";
import {Geolocation} from "@ionic-native/geolocation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public collection: AngularFirestoreCollection<Post>;
  public posts: Observable<Post[]>;
  @ViewChild("slider") slider: Slides;
  page = 0;


  constructor(public navCtrl: NavController, private angularFireStore: AngularFirestore, public geolocation: Geolocation) {
    this.collection = this.angularFireStore.collection<any>("posts");
    this.posts = this.collection.snapshotChanges().map(actions => {
      return actions.map(action => {
        let data = action.payload.doc.data() as Post;
        let id = action.payload.doc.id;

        return {
          id,
          ...data,
        };
      })
    });
  }

  goToAddPostPage() {
    this.navCtrl.push("AddPostPage", {
      postCollection: this.collection
    });
  }

  goToDetailsPage(post: Post) {
    this.navCtrl.push("DetailPage", {
      post,
      postCollection: this.collection
    });
  }

  goToMapPage() {
    this.navCtrl.push("MapPage");
  };

  logOut() {
    this.angularFireStore.app.auth().signOut();
  }

  //slider that takes the index and lets the user slide between the pages
  selectedTab(index) {
    this.slider.slideTo(index);
    this.slider.clickedIndex = index;
  }

  // displayMap(){
  //   let modalControlView = this.modalController.create(MapPage);
  //   modalControlView.onDidDismiss(position =>{
  //     console.log(position);
  //   });
  //   modalControlView.present();
  // }
}
