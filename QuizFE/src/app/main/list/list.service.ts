import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public option = {
    headers: {
      "Content-type": "application/json"
    }
  }

  constructor(private _http: HttpClient) { }

  getUserList(): Observable<User[]> {
    return this._http.get<User[]>(`${environment.apiUrl}/users`)
  }

  getUserDetail(id: number): Observable<User> {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  creatUser(user: User): Observable<User> {
    return this._http.post<User>(`${environment.apiUrl}/users`, user, this.option);
  }

  deleteUser(id: number): Observable<User> {
    return this._http.delete<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this._http.put<User>(`${environment.apiUrl}/users/${user.id}`, user, this.option);
  }
}
