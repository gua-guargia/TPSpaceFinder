import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

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
  newusername: string
  newpassword: string
  newemail: string
  newgender: string
  mainuser: AngularFirestoreDocument
  sub
  busy: boolean = false

  constructor(
    private afs: AngularFirestore, 
    private user: UserService,
    private alertController: AlertController
  ) { 
    this.mainuser = afs.doc(`Users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.username = event.username
      this.password = event.password
      this.email = event.email
      this.gender = event.gender
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

		if(!this.password) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a password')
    }
    
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

		if(this.newpassword) {
			await this.user.updatePassword(this.newpassword)
		}


		if(this.username !== this.user.getUsername()) {
			await this.user.updateEmail(this.username)
			this.mainuser.update({
				username: this.username
			})
		}

		this.password = ""
    this.newpassword = ""
    this.username = ""
    this.newusername = ""
    this.email = ""
    this.newemail = ""
    this.gender = ""
		this.newgender = ""
		this.busy = false

		await this.presentAlert('Done!', 'Your profile was updated!')

		//this.router.navigate(['/tabs/feed'])
	}

}
