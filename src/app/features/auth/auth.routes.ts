import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.page';
import { SignupPageComponent } from './pages/signup/signup.page';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password.page';
import { OtpPageComponent } from './pages/otp/otp.page';
import { ResetPasswordPageComponent } from './pages/reset-password/reset-password.page';

export const AUTH_ROUTES: Routes = [
  { path: 'login',            component: LoginPageComponent },
  { path: 'signup',           component: SignupPageComponent },
  { path: 'forgot-password',  component: ForgotPasswordPageComponent },
  { path: 'otp',              component: OtpPageComponent },
  { path: 'reset-password',   component: ResetPasswordPageComponent },
  { path: '',                 redirectTo: 'login', pathMatch: 'full' },
];
