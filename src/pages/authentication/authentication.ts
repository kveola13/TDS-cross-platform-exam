import {Component} from '@angular/core';
import {IonicPage, ToastController} from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";


@IonicPage()
@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
})
export class AuthenticationPage {

  public user = {
    username: "",
    password: ""
  };

  constructor(public toastController: ToastController, private angularFire: AngularFirestore) {

  }
  //Created individual toasts that inform, but are still vague
  //So a hacker cannot easily get information about what was wrong.
  showLogInSuccessMessageToUser() {
    let toast = this.toastController.create({
      message: "Successful login",
      duration: 2500,
      position: "bottom",
      //Attempted to style the css class
      // cssClass: "toast"
    });
    toast.present();
  }
  showLogInFailureMessageToUser(error: String) {
    let toast = this.toastController.create({
      message: "" + error,
      duration: 2500,
      position: "bottom",
      //Attempted to style the css class
      // cssClass: "toast"
    });
    toast.present();
  }
  showRegisterSuccessMessageToUser() {
    let toast = this.toastController.create({
      message: "Successful registration",
      duration: 2500,
      position: "bottom",
      //Attempted to style the css class
      // cssClass: "toast"
    });
    toast.present();
  }

  showRegisterFailureMessageToUser(error: String) {
    let toast = this.toastController.create({
      message: "" + error,
      duration: 2500,
      position: "bottom",
      //Attempted to style the css class
      // cssClass: "toast"
    });
    toast.present();
  }
  //Logs the user in through firebase
  logInUser() {
    this.angularFire.app.auth().signInWithEmailAndPassword(this.user.username, this.user.password).then(response => {
      console.log(response);
      this.showLogInSuccessMessageToUser();
    }).catch(error => {
      console.log(error);
      this.showLogInFailureMessageToUser(error);
    })
  }

  //Registers the user through firebase
  registerUser() {
    this.angularFire.app.auth().createUserWithEmailAndPassword(this.user.username, this.user.password)
      .then(response => {
        console.log(response);
        this.showRegisterSuccessMessageToUser();
      }).catch(error => {
      console.log(error);
      this.showRegisterFailureMessageToUser(error);
    });
  }
}
