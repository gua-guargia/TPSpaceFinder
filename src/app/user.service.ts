import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
//import { Observable } from 'rxjs';
//import { User } from 'firebase'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'

interface user {
    //username: string,
    email: string,
    //password: string,
    //gender: string,
    uid: string
}

@Injectable()
export class UserService {
    private user: user
    //afUser: User
    
    constructor(
        public afAuth: AngularFireAuth, 
        public afstore: AngularFirestore
    ) {
    }

    setUser(user:user) {
        this.user = user
    }

    // To get email
    getUsername(): string {
		return this.user.email
	}

    async reAuth(email: string, password: string) {
        return (await this.afAuth.currentUser).reauthenticateWithCredential(auth.EmailAuthProvider.credential(email, password))
	}
//
    async updatePassword(newpassword: string) {
        //update the firestore as well
        await this.afstore.doc(`Users/${this.user.uid}`).update({
            password: newpassword});
        return (await this.afAuth.currentUser).updatePassword(newpassword)
	}

	async updateEmail(newemail: string) {
        //update the firestore as well
        await this.afstore.doc(`Users/${this.user.uid}`).update({
            email: newemail})
		return (await this.afAuth.currentUser).updateEmail(newemail)
    }

    //update the firestore for username
    async updateUsername(newusername: string) {
        return await this.afstore.doc(`Users/${this.user.uid}`).update({
            username: newusername})
    }

    //update the firestore for gender
    async updateGender(newgender: string) {
        console.log("update the gender");
		return await this.afstore.doc(`Users/${this.user.uid}`).update({
            gender: newgender})
    }
    

    async isAuthenticated() {
		if(this.user) return true

		const user = await this.afAuth.authState.pipe(first()).toPromise()

		if(user) {
			this.setUser({
				email: user.email,
				uid: user.uid
			})

			return true
		}
		return false
	}


    getUID() {
        return this.user.uid
    }
}