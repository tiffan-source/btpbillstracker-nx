import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Input, Label, PageSubTitle, PageTitle, Button, ToastService, Toast } from '@btpbilltracker/components';
import { AuthFormField, LoginForm } from 'src/app/forms/login.form';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, PageTitle, PageSubTitle, Label, Input, Button, RouterLink],
  templateUrl: './login.html',
})
export class Login {
    loginForm = new LoginForm();
    authService = inject(AuthService);
    toastService = inject(ToastService);
    protected readonly AuthFormField = AuthFormField;

    constructor() {
        effect(() => {
            let error = this.authService.processError()
            if(error !==  null) {                
                this.toastService.showToast('error', error);
            }
        });
    }

    login() {
        const { email, password } = this.loginForm.value;
        if (email && password) {
            this.authService.loginWithEmailAndPassword(email, password);
        }
    }
}
