import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Data} from '../_model/data';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public save(data: Data): Observable<string> {
    return this.httpClient.post(environment.backend + '/data/text', data, {responseType: 'text'});
  }
}
