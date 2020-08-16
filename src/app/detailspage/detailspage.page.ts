import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.page.html',
  styleUrls: ['./detailspage.page.scss'],
})
export class DetailspagePage implements OnInit {

  data: any
  public myimage = '../../assets/image/emptyheart.png'
  mainuser: AngularFirestoreDocument
  favouriteLocations
  UID
  //newfavouriteLocations
  exist
  sub
  busy: boolean = false
 
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private afs: AngularFirestore, 
    private user: UserService) {
    //for the pass info from the search page
    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.value);
    });

    //for get favoriteLocations info from firestore
    this.UID = user.getUID
    this.mainuser = afs.doc(`Users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.favouriteLocations = event.favouriteLocations
    });
    console.log(this.favouriteLocations);
    console.log(user.getUID);
    
  }
 
  ngOnInit() {
    //update the favorite status
    this.checkImage();
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
  }

  checkImage() {
    this.exist = this.favouriteLocations.find(e => e === this.data.name);
    //this.exist = this.favouriteLocations.includes(this.data.name);
    if(this.exist == false) {
      this.myimage = '../../assets/image/emptyheart.png';
      console.log('string[]!');
    }
    else {
      this.myimage = '../../assets/image/filledheart.png';
      console.log('yes, the user has set this location as their favourite');
    }
  }

  async addEvent() {
    this.busy = true

    if(this.myimage == '../../assets/image/emptyheart.png') {
      this.myimage = '../../assets/image/filledheart.png';
      this.favouriteLocations.push(this.data.name)
      await this.user.updateFavouriteLocation(this.favouriteLocations);
    }
    else {
      this.myimage = '../../assets/image/emptyheart.png';
      for( var i = 0; i < this.favouriteLocations.length; i++) { 
        if ( this.favouriteLocations[i] === this.data.name) { 
          this.favouriteLocations.splice(i, 1); 
          i--; 
        }
      }
      await this.user.removeFavouriteLocation(this.favouriteLocations);
      //this.removeFavorite;
    }

    this.busy = false

  }


}
