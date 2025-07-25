/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap, filter, take } from 'rxjs/operators';

/**
 * Service for managing loan details with intelligent caching
 * Prevents duplicate API calls and provides fresh data when needed
 */
@Injectable({
  providedIn: 'root'
})
export class LoanDetailsCacheService {
  
  // Cache for loan details to prevent duplicate API calls
  private loanDetailsCache = new Map<string, Observable<any>>();
  
  // Cache for loan delinquency data
  private delinquencyDataCache = new Map<string, Observable<any>>();
  
  // Cache for loan datatables
  private datatablesCache = new Map<string, Observable<any>>();
  
  // Cache for loan delinquency tags
  private delinquencyTagsCache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  /**
   * Get loan details with associations, using intelligent caching
   * @param loanId Loan ID
   * @returns Observable with loan details
   */
  getLoanDetails(loanId: string): Observable<any> {
    return this.getCachedData(
      this.loanDetailsCache,
      loanId,
      () => this.http.get(`/loans/${loanId}`, {
        params: new HttpParams()
          .set('associations', 'all')
          .set('exclude', 'guarantors,futureSchedule')
      })
    );
  }

  /**
   * Get loan delinquency data with caching
   * @param loanId Loan ID
   * @returns Observable with delinquency data
   */
  getDelinquencyData(loanId: string): Observable<any> {
    return this.getCachedData(
      this.delinquencyDataCache,
      loanId,
      () => this.http.get(`/loans/${loanId}`, {
        params: new HttpParams()
          .set('associations', 'collection')
          .set('exclude', 'guarantors,futureSchedule')
      })
    );
  }

  /**
   * Get loan datatables with caching
   * @param apptable Table name
   * @returns Observable with datatables
   */
  getDatatables(apptable: string): Observable<any> {
    return this.getCachedData(
      this.datatablesCache,
      apptable,
      () => this.http.get(`/datatables`, {
        params: new HttpParams().set('apptable', apptable)
      })
    );
  }

  /**
   * Get loan delinquency tags with caching
   * @param loanId Loan ID
   * @returns Observable with delinquency tags
   */
  getDelinquencyTags(loanId: string): Observable<any> {
    return this.getCachedData(
      this.delinquencyTagsCache,
      loanId,
      () => this.http.get(`/loans/${loanId}/delinquencytags`)
    );
  }

  /**
   * Generic method to get cached data or create new request
   * @param cache Map to store cached data
   * @param key Cache key
   * @param requestFactory Function to create new request
   * @returns Observable with cached or new data
   */
  private getCachedData<T>(
    cache: Map<string, Observable<T>>,
    key: string,
    requestFactory: () => Observable<T>
  ): Observable<T> {
    // Check if we already have a cached request for this key
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Create new request with caching
    const request = requestFactory().pipe(
      shareReplay(1) // Cache the result and share it with all subscribers
    );

    // Store the request in cache
    cache.set(key, request);

    // Clean up cache after 5 minutes to prevent memory leaks
    setTimeout(() => {
      cache.delete(key);
    }, 5 * 60 * 1000);

    return request;
  }

  /**
   * Clear cache for a specific loan or all loans
   * @param loanId Optional loan ID to clear specific cache entries
   */
  clearLoanCache(loanId?: string): void {
    if (loanId) {
      this.loanDetailsCache.delete(loanId);
      this.delinquencyDataCache.delete(loanId);
      this.delinquencyTagsCache.delete(loanId);
    } else {
      this.loanDetailsCache.clear();
      this.delinquencyDataCache.clear();
      this.delinquencyTagsCache.clear();
    }
  }

  /**
   * Clear datatables cache
   * @param apptable Optional table name to clear specific cache entry
   */
  clearDatatablesCache(apptable?: string): void {
    if (apptable) {
      this.datatablesCache.delete(apptable);
    } else {
      this.datatablesCache.clear();
    }
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.loanDetailsCache.clear();
    this.delinquencyDataCache.clear();
    this.datatablesCache.clear();
    this.delinquencyTagsCache.clear();
  }
} 