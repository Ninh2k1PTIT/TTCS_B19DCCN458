import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from 'src/app/models/question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  public option = {
    headers: {
      "Content-type": "application/json"
    }
  }

  constructor(private _http: HttpClient) { }

  getExamList(): Observable<Exam[]> {
    return this._http.get<Exam[]>(`${environment.apiUrl}/exams`)
  }

  getExamDetail(id: number): Observable<Exam> {
    return this._http.get<Exam>(`${environment.apiUrl}/exams/${id}`);
  }

  createExam(exam: Exam): Observable<Exam> {
    return this._http.post<Exam>(`${environment.apiUrl}/exams`, exam, this.option);
  }

  deleteExam(id: number): Observable<Exam> {
    return this._http.delete<Exam>(`${environment.apiUrl}/exams/${id}`);
  }

  updateExam(exam: Exam): Observable<Exam> {
    return this._http.put<Exam>(`${environment.apiUrl}/exams/${exam.id}`, exam, this.option);
  }
}
