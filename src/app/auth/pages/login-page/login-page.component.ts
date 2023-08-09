import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private authService = inject(AuthService);
  private router      = inject(Router);

  public myForm = new FormGroup({
    email: new FormControl('mario@gmail.com'),
    password: new FormControl('asd.456'),
  });

  login() {

    const { email, password } = this.myForm.value;

    this.authService.login(email || '', password || '').subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (message) => { Swal.fire('Error', message, 'error') }
    });
  }

}
