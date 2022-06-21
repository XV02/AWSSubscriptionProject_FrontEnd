import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';

const HTTP_CONFLICT_ERROR_CODE = 409;

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.component.html',
  styleUrls: ['./register-email.component.scss']
})
export class RegisterEmailComponent implements OnInit {

  form: FormGroup;

  serverError: boolean = false;
  duplicatedError: boolean = false;
  success: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService
  ) {
    this.form = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
  }

  registerEmail(){
    if(this.form.valid){
      this.emailService.register({
        email: this.form.value.email,
      }).then(() => {
        this.success = true;
        this.duplicatedError = false;
        this.serverError = false;
      }).catch(error => {
        //Error Conflict: Duplicated
        if(error.status == HTTP_CONFLICT_ERROR_CODE){
          this.duplicatedError = true;
          this.serverError = false;
          this.success = false;
        }
        else{
          this.serverError = true;
          this.duplicatedError = false;
          this.success = false;
        }
      });
    }else{
      console.log('Error, data missing', this.form);
      console.log(this.form.invalid);
      console.log(this.form.valid);
    }
  }
}
