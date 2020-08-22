import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authetication.service';

@Component({
  selector: 'app-password-resetpage',
  templateUrl: './password-resetpage.page.html',
  styleUrls: ['./password-resetpage.page.scss'],
})
export class PasswordResetpagePage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ]
  };

  resetPassword(value) {
    this.authService.resetPassword(value.email);
    this.errorMessage = "Email sent!";
  }
  back(){
    this.navCtrl.navigateRoot('/home');
  }

}
