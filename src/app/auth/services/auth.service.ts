import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import { AuthStatus, CheckToekenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: String = environments.baseUrl;

  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());


  constructor() {

    this.checkAuthStatus().subscribe();

   }

  login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password }

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        tap(({ user, token }) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticate);
          localStorage.setItem('token', token)
          console.log({ user, token })
        }),
        map(() => true),
        // error
        catchError(err => throwError(() => err.error.message))
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token);

    return this.http.get<CheckToekenResponse>(url, { headers })
      .pipe(
        map(({ token, user }) => {
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticate);
          localStorage.setItem('token', token)

          return true;
        }),
        //error
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticate);
          return of(false);
        })
      )
  }

  logout(){
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticate);
  }
}


