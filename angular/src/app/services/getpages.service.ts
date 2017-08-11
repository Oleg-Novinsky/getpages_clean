import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';



const config = require('../../../../config/database');
const ipConnection = config.ipConnection;

@Injectable()
export class GetpagesService {

  constructor(
    private http: Http
  ) { }

  getDataFromPages(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/getpages/getdatafrompages', data, {headers: headers})
    .map(res => res.json());
  }

  gneratePdf(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://'+ipConnection+'/getpages/generatepdf', data, {headers: headers})
    .map(res => res.json());
  }

  getPdf(filename) {
    return this.http.post('http://'+ipConnection+'/getpages/download',filename,
                   { responseType: ResponseContentType.Blob })
      .map((res) => {
            return new Blob([res.blob()], { type: 'application/pdf' })
        })
  }



}
