import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  public userInfo: any;
  public loading;
  constructor(
    private router: Router,
    private fb: Facebook,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService
  ) { }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Connecting ...'
    });
  }
  async login() {

    this.fb.login(['email'])
      .then((response: FacebookLoginResponse) => {
        this.onLoginSuccess(response);
        console.log(response.authResponse.accessToken)
        this.fireAuth.onAuthStateChanged(user => {
          if (user) {
            this.userInfo = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            };
          }
        });
      }).catch((error) => {
        console.log(error);
        alert('error:' + error);
      });
  }

  onLoginSuccess(res: FacebookLoginResponse) {
    // const { token, secret } = res;
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((response) => {
        this.afstore.doc(`Users/${this.userInfo.uid}`).set({
          favouriteLocations: [],
          username: this.userInfo.displayName,
          password: "",
          email: this.userInfo.email,
          gender: "Male"})
        this.user.setUser({
            email: this.userInfo.email,
            uid: this.userInfo.uid
        })
        this.router.navigate(['/dashboard']);
        this.loading.dismiss();
      });

  }

}
