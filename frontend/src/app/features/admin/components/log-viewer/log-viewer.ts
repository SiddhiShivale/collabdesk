import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { LogService } from '../../../../core/services/log';
import { Log } from '../../../../core/models/log-model';
import { Page } from '../../../../core/models/page-model';

@Component({
  selector: 'app-log-viewer',
  standalone: false,
  templateUrl: './log-viewer.html',
  styleUrl: './log-viewer.css',
})
export class LogViewerComponent implements OnInit {
  logsPage$!: Observable<Page<Log>>;
  private refreshTrigger$ = new Subject<void>();

  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50, 100];
  totalElements = 0;

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.logsPage$ = this.refreshTrigger$.pipe(
      startWith(null),
      switchMap(() => this.logService.getLogs(this.currentPage, this.pageSize)),
      map((page) => {
        this.totalElements = page.totalElements;
        this.currentPage = page.number;
        return page;
      })
    );
  }

  loadLogs(): void {
    this.refreshTrigger$.next();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLogs();
  }

  onPageSizeChange(event: Event): void {
    const newSize = (event.target as HTMLSelectElement).value;
    this.pageSize = +newSize;
    this.currentPage = 0;
    this.loadLogs();
  }
}
