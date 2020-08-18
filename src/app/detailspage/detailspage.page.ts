import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
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
  public favouriteLocations
  UID
  exist
  //newfavouriteLocations
  //public exist: boolean = false
  sub
  busy: boolean = false

  //google map
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search',{static:false})
  public searchElementRef: ElementRef;
 
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private afs: AngularFirestore, 
    private user: UserService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
    ) {
    //for the pass info from the search page
    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.value);
    });

    //for get favoriteLocations info from firestore
    this.UID = user.getUID
    this.mainuser = afs.doc(`Users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.favouriteLocations = event.favouriteLocations;
      for( var i = 0; i < this.favouriteLocations.length; i++) { 
        if ( this.favouriteLocations[i] === this.data.name) { 
          this.myimage = '../../assets/image/filledheart.png';
        }
      }
    });
    console.log(this.favouriteLocations);
    console.log(user.getUID);
    
  }


 
  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
  }


    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 8;
          this.getAddress(this.latitude, this.longitude);
        });
      }
    }

  markerDragEnd($event: any) {
      console.log($event);
      this.latitude = $event.coords.lat;
      this.longitude = $event.coords.lng;
      this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        console.log(results);
        console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
  
      });
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
