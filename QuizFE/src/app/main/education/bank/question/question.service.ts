import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/app/models/question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public option = {
    headers: {
      "Content-type": "application/json"
    }
  }

  constructor(private _http: HttpClient) { }

  getQuestionList(): Observable<Question[]> {
    return this._http.get<Question[]>(`${environment.apiUrl}/questions`)
  }

  getQuestionDetail(id: number): Observable<Question> {
    return this._http.get<Question>(`${environment.apiUrl}/questions/${id}`);
  }

  createQuestion(Question: Question): Observable<Question> {
    return this._http.post<Question>(`${environment.apiUrl}/questions`, Question, this.option);
  }

  deleteQuestion(id: number): Observable<Question> {
    return this._http.delete<Question>(`${environment.apiUrl}/questions/${id}`);
  }

  updateQuestion(Question: Question): Observable<Question> {
    return this._http.put<Question>(`${environment.apiUrl}/questions/${Question.id}`, Question, this.option);
  }
}
