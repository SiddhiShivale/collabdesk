import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../models/log-model';
import { Page } from '../models/page-model';
@Injectable({
  providedIn: 'root',
})
export class LogService {
  private baseUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {}

   getLogs(page: number, size: number): Observable<Page<Log>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Log>>(this.baseUrl, { params });
  }

  getAllLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/all`);
  }
}
