import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { LogService } from '../../../../core/services/log';
import { Log } from '../../../../core/models/log-model';
import { Page } from '../../../../core/models/page-model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-viewer',
  standalone: false,
  templateUrl: './log-viewer.html',
  styleUrl: './log-viewer.css',
})
export class LogViewerComponent implements OnInit {
  pagedLogs$!: Observable<Log[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);
  private allLogs$ = new BehaviorSubject<Log[]>([]);

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50, 100];

  usernameFilter = new FormControl('');
  actionFilter = new FormControl('');
  detailsFilter = new FormControl('');
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.setupDataStream();
  }

  setupDataStream(): void {
    this.refresh$
      .pipe(switchMap(() => this.logService.getAllLogs()))
      .subscribe((logs) => {
        this.allLogs$.next(logs);
      });

    const filters$ = combineLatest([
      this.usernameFilter.valueChanges.pipe(startWith('')),
      this.actionFilter.valueChanges.pipe(startWith('')),
      this.detailsFilter.valueChanges.pipe(startWith('')),
      this.startDateFilter.valueChanges.pipe(startWith('')),
      this.endDateFilter.valueChanges.pipe(startWith('')),
    ]).pipe(debounceTime(300));

    this.pagedLogs$ = combineLatest([this.allLogs$, filters$]).pipe(
      map(([logs, [username, action, details, startDate, endDate]]) => {
        let filteredLogs = logs.filter(
          (log) =>
            log.username
              .toLowerCase()
              .includes(username?.toLowerCase() ?? '') &&
            log.action.toLowerCase().includes(action?.toLowerCase() ?? '') &&
            log.details.toLowerCase().includes(details?.toLowerCase() ?? '')
        );

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          filteredLogs = filteredLogs.filter(
            (log) => new Date(log.timestamp) >= start
          );
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filteredLogs = filteredLogs.filter(
            (log) => new Date(log.timestamp) <= end
          );
        }

        this.totalElements = filteredLogs.length;

        const startIndex = this.currentPage * this.pageSize;
        return filteredLogs.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  loadLogs(): void {
    this.refresh$.next();
  }

  resetFilters(): void {
    this.usernameFilter.setValue('');
    this.actionFilter.setValue('');
    this.detailsFilter.setValue('');
    this.startDateFilter.setValue('');
    this.endDateFilter.setValue('');
    this.currentPage = 0;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.allLogs$.next(this.allLogs$.value);
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
    this.allLogs$.next(this.allLogs$.value);
  }
}
