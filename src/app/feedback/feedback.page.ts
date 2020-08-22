import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  feedback: string
  email: string
  uid: string
  mainuser: AngularFirestoreDocument
  username: string
  sub

  constructor(
    private afs: AngularFirestore, 
    private user: UserService,
  ) {  
    this.mainuser = afs.doc(`Users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.email = event.email})
   }


  ngOnInit() {
  }

  async uploadFeedback() {
    const { feedback } = this
    if(this.feedback) {
      this.afs.doc(`Feedback/${this.user.getUID()}`).set({
        email: this.email,
          feedback: this.feedback})
		}
  }
}
