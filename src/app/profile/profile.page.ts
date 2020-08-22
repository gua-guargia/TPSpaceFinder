import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  username: string
  password: string
  gender: string
  email: string
  oldusername: string
  newpassword: string
  oldemail: string
  oldgender: string
  mainuser: AngularFirestoreDocument
  sub
  busy: boolean = false
  

  constructor(
    private afs: AngularFirestore, 
    private user: UserService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { 
    this.mainuser = afs.doc(`Users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.username = event.username
      //this.password = event.password
      this.email = event.email
      this.gender = event.gender
      this.oldemail = event.email
      this.oldgender = event.gender
      this.oldusername = event.username
		})
  }

  ngOnInit() {
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
  }
  
  async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
  }
  

  async updateDetails() {
		this.busy = true

    //for the password
		if(!this.password) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a password')
    }

    try {
			await this.user.reAuth(this.user.getUsername(), this.password)
		} catch(error) {
			this.busy = false
			return this.presentAlert('Error!', 'Wrong password!')
    }
    
    if(this.newpassword) {
			await this.user.updatePassword(this.newpassword)
		}

    
    //username and gender
    if(!this.username) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a username')
    }
    
    if(!this.gender) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a gender')
    }
    
    if(!this.email) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a email')
		}

		if(this.username !== this.oldusername) {
			await this.user.updateUsername(this.username)
    }
    
    if(this.gender !== this.oldgender) {
			await this.user.updateGender(this.gender)
    }
    
		if(this.email !== this.oldemail) {
			await this.user.updateEmail(this.email)
			//this.mainuser.update({
			//	email: this.email
			//})
		}

		this.password = ""
    this.newpassword = ""
		this.busy = false

    await this.presentAlert('Done!', 'Your profile was updated!')
    //.then(res => this.navCtrl.navigateForward('/dashboard'));
    
    
		//this.router.navigate(['/tabs/feed'])
  }
  
  back(){
    this.navCtrl.navigateRoot('/dashboard');
  }

}
