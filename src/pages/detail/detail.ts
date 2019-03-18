import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Post} from "../../models/Post";
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  public post: Post;
  public postCollection: AngularFirestoreCollection<Post>;
  public comments: Observable<any[]>;
  public commentInput: string = "";
  public author: string = "";
  //We need the email to verify if the user is the creator of the post
  public sellerEmail = this.angularFire.app.auth().currentUser.email.toString();

  constructor(
    public toastController: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public angularFire: AngularFirestore,
    public angularFireStore: AngularFirestore) {

    this.post = this.navParams.get("post");
    this.author = angularFire.app.auth().currentUser.email.split("@")[0];
    this.postCollection = this.navParams.get("postCollection");
    this.comments = this.postCollection
      .doc(this.post.id)
      .collection("subCollection")
      .valueChanges();
  }

  //Users can add comments to express interest or to haggle
  addComment() {
    this.postCollection
      .doc(this.post.id)
      .collection("subCollection")
      .add({
        body: this.commentInput
      });
    this.commentInput = "";
  }

  //If the book is sold or the seller is no longer interested in selling
  //they can sell the book
  deleteBook() {
    //Only the seller can delete the post
    if (this.sellerEmail == this.post.email) {
      this.postCollection
        .doc(this.post.id)
        .delete();
      this.navCtrl.push(HomePage);
    } else {
      this.showDeleteBookError();
    }
  }
  //If the user is not the creator of the post
  showDeleteBookError() {
    let toast = this.toastController.create({
      message: "You must be the creator of the post to delete it.",
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
}
