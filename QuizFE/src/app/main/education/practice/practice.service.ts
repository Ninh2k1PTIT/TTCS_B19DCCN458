import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  public option = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  constructor(private _http: HttpClient) {}

  saveAnswers(body: any) {
    return this._http.post<any>(
      `${environment.apiUrl}/diary`,
      body,
      this.option
    );
  }

  getAnswers() {
    return this._http.get<any>(`${environment.apiUrl}/diary`);
  }

  getAnswersById(id: number) {
    return this._http.get<any>(`${environment.apiUrl}/diary/${id}`);
  }


  deleteAnswer(id: number) {
    return this._http.delete<any>(`${environment.apiUrl}/diary/${id}`);
  }
}
