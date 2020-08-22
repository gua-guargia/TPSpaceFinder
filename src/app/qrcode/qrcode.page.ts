import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { first, map } from 'rxjs/operators';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  seatsTaken: boolean
  name: string
  uid: string
  mainuser: AngularFirestoreDocument
  username: string
  sub
  locationRef
  public locationList: any[];

  constructor(
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    protected afs: AngularFirestore, 
    protected user: UserService
    ) {
      // this.mainuser = afs.doc(`Locations/${user.getUID()}`)
      // this.sub = this.mainuser.valueChanges().subscribe(event => {
      //   this.email = event.email})
      
    }

  async ngOnInit() {
    this.locationList = await this.initializeItems();
  }

  async initializeItems(): Promise<any> {
    const locationList = await this.afs.collection('Locations')
      .valueChanges().pipe(first()).toPromise();
    return locationList;
  }

  scanActive = false;
  scanResult = null;
  @ViewChild('video', {static: false}) video: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  resData: any[]
  location: string;
  state: string;

  loading: HTMLIonLoadingElement;

  

  ngAfterViewInit(){
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async startScan(){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

 async scan() {
   console.log('SCAN');
 

    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA){
      if(this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData= this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log('code: ', code);
      
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.resData = code.data.split('_');
       if(this.resData.length=2){
         this.location = this.resData[0];
          this.state = this.resData[1];
          console.log(this.location); 
          console.log(this.state); 
          console.log(this.locationList)
          for (var lo of this.locationList){
            if (lo.name == this.location){
              if (lo.seats[this.state] == false){
                lo.seats[this.state] = true
                this.afs.doc(`Locations/${this.location}`).update({
                  "seats[this.state]": true
                })
              }else{
                lo.seats[this.state] = false
              }
              console.log(lo.seats[this.state])
              // console.log(lo.seats)
          }

       }

       //do not delete#####################################
      //  Object.keys(lo.seats).forEach(function(key) {
      //   console.log(key);
      //   console.log(lo.seats[key]);
      // });

        // Object.keys(lo.seats).forEach(function(key) {
              //   console.log(key+": "+lo.seats[key]);
              // });
            //   for (let key of lo.seats.keys()) {
            //     console.log(key);                   //Lokesh Raj John
            // }
            // this.mainuser = this.afs.doc(`Locations/${this.location}`)
            // this.sub = this.mainuser.get()
          }
          // for (var s of lo.seats){
          //   // if (String(s)== this.state){
          //   //   console.log(lo.seats.s)
          //   // }
          // }
          
          // this.afs.doc(`Locations/${this.location}`).update({
          //   "seats.A0": true
          // })
        // this.afs.doc(`Locations/${this.user.getUID()}`).set({
          //   email: this.state})

          // this.mainuser = this.afs.doc(`Locations/${this.location}`)
          // // this.sub = this.mainuser.valueChanges().subscribe(event => {
          // //   this.seatsTaken = event.seats.A0
          // // })
          // // console.log(this.mainuser);

          
        //   this.afs.doc(`Locations/${this.location}`).update({
        //    "seats.A0": false,
        //    "seats.A1": false,
        //    "seats.A2": false,
        //    "seats.A3": false,
        //    "seats.A4": false,
        //    "seats.B0": false,
        //    "seats.B1": false,
        //    "seats.B2": false,
        //    "seats.B3": false,
        //    "seats.B4": false,
        //    "seats.C0": false,
        //    "seats.C1": false,
        //    "seats.C2": false,
        //    "seats.C3": false,
        //    "seats.C4": false,
        //    "seats.D0": false,
        //    "seats.D1": false,
        //    "seats.D2": false,
        //    "seats.D3": false,
        //    "seats.D4": false,
        //    "seats.E0": false,
        //    "seats.E1": false,
        //    "seats.E2": false,
        //    "seats.E3": false,
        //    "seats.E4": false,
        //    "seats.F0": false,
        //    "seats.F1": false,
        //    "seats.F2": false,
        //    "seats.F3": false,
        //    "seats.F4": false,
        //    "seats.G0": false,
        //    "seats.G1": false,
        //    "seats.G2": false,
        //    "seats.G3": false,
        //    "seats.G4": false,
        //    "seats.H0": false,
        //    "seats.H1": false,
        //    "seats.H2": false,
        //    "seats.H3": false,
        //    "seats.H4": false,
        //  })
          
          // this.locationRef = this.afs.collection('Locations'); 
          // // const updatedSeats = {
            
          // // }
          // this.locationRef.doc(this.location).valueChanges().subscribe(event => {
          //   this.seatsTaken = event.seatsTaken
          // })
          // console.log(this.seatsTaken);
            // this.locationRef.doc(this.location).update({ 
            //   seats: 
            // });
          
          // this.sub = this.mainuser.valueChanges().subscribe(event => {
          //     this.seatsTaken = event.seatsTaken})
          //     console.log(this.seatsTaken);
       
          
          
        
        // this.showQRToast();
      }else{
        if (this.scanActive){
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    }else{
      requestAnimationFrame(this.scan.bind(this));
    }

   

   



  }


  // Helper functions
  stopScan(){
    this.scanActive = false;
  }

  reset(){
    this.scanResult = null;
  }

  async showQRToast(){
    const toast = await this.toastCtrl.create({
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }

}

