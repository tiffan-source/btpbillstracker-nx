import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button, Input, Label, PageSubTitle, PageTitle, Toast, ToastService } from '@btpbilltracker/components';
import { NewUserFormField, RegisterForm } from 'src/app/forms/register.form';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [Button, RouterLink, PageTitle, PageSubTitle, ReactiveFormsModule, Label, Input, Toast],
  templateUrl: './register.html',
})
export class Register {

    registerForm = new RegisterForm();
    authService = inject(AuthService);
    toastService = inject(ToastService);
    protected readonly NewUserFormField = NewUserFormField;
    
    constructor() {
        effect(() => {
            let error = this.authService.processError()
            if(error !==  null) {
                console.log(error);
                
                this.toastService.showToast('error', error);
            }
        });
    }

    register() {        
        const { email, password, confirmPassword } = this.registerForm.value;
        if (email && password && confirmPassword) {
            this.authService.registerWithEmailAndPassword(email, password, confirmPassword);
        }
    }
}
