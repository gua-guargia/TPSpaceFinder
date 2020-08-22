// register.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../services/authetication.service';//typo
import { NavController } from '@ionic/angular';
import { User } from 'firebase';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  genderOptions = ['Female', 'Male', 'Other'];
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'username': [
      { type: 'required', message: 'Username is required.'}
    ],
    'gender': [
      { type: 'required', message: 'Gender is required.'}
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    public user: UserService,
    public afstore: AngularFirestore
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  tryRegister(value) {
    this.authService.registerUser(value)
      .then(res => {
        console.log(res);
        this.afstore.doc(`Users/${res.user.uid}`).set({
          favouriteLocations: [],
          username: value.username,
          password: value.password,
          email: value.email,
          gender: value.gender})
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
      
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  goLoginPage() {
    this.navCtrl.navigateBack('/login');
  }

  back(){
    this.navCtrl.navigateRoot('/home');
  }

}
