import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { async } from '@angular/core/testing';
//import { WonderPush } from '@ionic-native/wonderpush/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';

declare var google: any;
export interface CombinedList{
  seatCode : string,
  status : string
}

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

  //for map
  map: any;
  @ViewChild('map', {read: ElementRef, static: false}) mapRef:ElementRef;
  infoWindows: any = [];
  markers: any = [
  {
    title: "The Short Circuit",
    latitude: "1.346270",
    longitude: "103.931577"
  },
  {
    title: "The Bread Board",
    latitude: "1.346772",
    longitude: "103.930154"
  },
  {
    title: "The Business Park",
    latitude: "1.344199",
    longitude: "103.933042"
  },
  {
    title: "The Designer Pad",
    latitude: "1.345174",
    longitude: "103.931471"
  },
  {
    title: "The Flavours",
    latitude: "1.345033",
    longitude: "103.934102"
  },
  {
    title: "McDonald's",
    latitude: "1.345318",
    longitude: "103.931810"
  },
  {
    title: "TripletS",
    latitude: "1.344686",
    longitude: "103.932225"
  },
  {
    title: "Subway",
    latitude: "1.344920",
    longitude: "103.932289"
  },
  {
    title: "Bistro Lab",
    latitude: "1.343949",
    longitude: "103.931801"
  },
  {
    title: "Sugarloaf",
    latitude: "1.346845",
    longitude: "103.929159"
  },
  {
    title: "Canopy Coffee Club Café",
    latitude: "1.345140",
    longitude: "103.935490"
  },
  {
    title: "The Top Table",
    latitude: "1.346483",
    longitude: "103.929196"
  }];

  //notification
  pushes: any = [];
  
  //the seats
  //public seatList: CombinedList[];
  public seatList: any[];


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private afs: AngularFirestore, 
    private user: UserService,
    private fcm: FCM, 
    public plt: Platform,
    private navCtrl: NavController
    //private wonderPush: WonderPush,
    //private push:Push
    //private mapsAPILoader: MapsAPILoader,
    //private ngZone: NgZone
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
    
    //for notification push
    this.plt.ready()
      .then(() => {
        this.fcm.onNotification().subscribe(data => {
          if (data.wasTapped) {
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          // Register your new token in your back-end if you want
          // backend.registerToken(token);
        });
      })
    /*this.plt.ready()
      .then(() => {
        this.wonderPush.subscribeToNotifications()
          .then(() => console.log("User subscribed to notifications"))
          .catch((error: any) => console.error(error));

      });*/

  }


  async ngOnInit() {
    this.seatList = await this.initializeItems();
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
  }

  //the seats
  async initializeItems(): Promise<any> {
    /*let seatList: CombinedList[];
    let myMap = this.data.seats;
    let keys = [...myMap.keys()];
    let values = [...myMap.values()];
    const totalSeats = this.data.seatsAvailable + this.data.seatsTaken;
    for(let j=0; j< totalSeats; j++) {
      this.seatList[j].seatCode = keys[j];
      if(values[j] == false) {
        seatList[j].status = "Avaliable";
      }
      else {
        seatList[j].status = "Taken";
      }
    }*/
    const seatList = this.data.seats;
    return seatList;
  }


  //the favourite image
  async addEvent() {
    this.busy = true

    if(this.myimage == '../../assets/image/emptyheart.png') {
      this.myimage = '../../assets/image/filledheart.png';
      this.favouriteLocations.push(this.data.name)
      await this.user.updateFavouriteLocation(this.favouriteLocations);
      //const onClick = (userConsent: boolean) => this.wonderPush.setUserConsent(userConsent);
      /*this.wonderPush.sendEvent('purchase', {
        float_price: 12.99,
        string_sku: "X123456"
      });*/
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

  //everytime we open this page, this function will run
  ionViewDidEnter() {
    this.initMap();
  }

  addMarkersToMap(markers) {
    for (let marker of markers) {
      if(marker.title == this.data.name) {
        let position = new google.maps.LatLng(marker.latitude, marker.longitude);
        let mapMarker = new google.maps.Marker({
          position: position,
          title: marker.title,
          latitude: marker.latitude,
          longitude: marker.longitude
        });

        mapMarker.setMap(this.map);
        this.addInfoWindowToMarker(mapMarker);
      }
    }
  }

  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id= "content">' + '<h2 id="firstHeading" class="firstHeading">' + marker.title + '</h2>' +
                            '<p>Latitude: ' + marker.latitude + '</p>' +
                            '<p>Longitude: ' + marker.longitude + '</p>' +
                            '</div>';
    let infoWindow = new google.maps.infoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });

    /*
    marker.addListener('idle', () => {
      if(marker.title == this.data.name) {
        this.closeAllInfoWindows();
        infoWindow.open(this.map, marker);
      }
    });*/

    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  initMap() {
    const location = new google.maps.LatLng(1.346845, 103.929159);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI : true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }


  //push notification
  
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  getToken() {
    this.fcm.getToken().then(token => {
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }

  back(){
    this.navCtrl.navigateBack;
  }

}

