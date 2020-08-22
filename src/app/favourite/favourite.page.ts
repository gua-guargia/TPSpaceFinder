import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.page.html',
  styleUrls: ['./favourite.page.scss'],
})
export class FavouritePage implements OnInit {
  email: string
  mainuser: AngularFirestoreDocument
  username: string
  sub
  favouriteplace: any[]
  // tasks: any[]

  constructor(
    private afs: AngularFirestore, 
    private user: UserService,
    private navCtrl: NavController
  ) { this.mainuser = afs.doc(`Users/${user.getUID()}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
    this.favouriteplace = event.favouriteLocations,
    this.email = event.email})
  }

  ngOnInit() {
  }

  fetch(){
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.favouriteplace = event.favouriteLocations,
      this.email = event.email
      console.log(this.favouriteplace)}
      )
  }

  back(){
    this.navCtrl.navigateRoot('/dashboard');
  }
}
