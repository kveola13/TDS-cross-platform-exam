import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {AngularFirestore} from "angularfire2/firestore";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, angularFire: AngularFirestore) {
    //needed to see if the user is registered or logged in
    const authenticateObserver = angularFire.app.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = "AuthenticationPage";
        }
      }
    );
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

