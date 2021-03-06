import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/toPromise';

import { User, Image, imageApi } from "../_data_model/index";
// import { User } from './user';

@Injectable()
export class ImageService {

  private imageUrl = imageApi;
  //set headers for authorization, https://stackoverflow.com/a/34465070/2803344
  createAuthorizationHeader(headers: Headers, name: string, pw: string) {
    // headers.append('Authorization', 'Basic ' +
    //   btoa(`${name}:${pw}`)); 
      headers.append('Authorization', 'JWT ' + pw);
  }

  createOptions(name: string, pw: string) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers, name, pw);
    // headers.append('Content-Type', 'application/json');  // without this
    // headers.append('Content-Type', 'multipart/form-data');  // without this
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  constructor(private http: Http) { }

  getImageById(id: number): Promise<Image> {
    const url = `${this.imageUrl}`;
    console.log(url);
    let headers = new Headers();
    let token = 'token';
    headers.append('X-Auth-Token', token);
    return this.http.get(url, {headers: headers})
                    .toPromise()
                    // .then(res => res.json().data as Image)
                    .then(res => console.log(res))
                    .catch(this.handleError);
  }

  getImageByUrl(url: string): Promise<Image> {
    console.log(url);
    return this.http.get(url)
                    .toPromise()
                    .then(res => {
                      console.log(res.json());
                      return res.json();
                      })
                    // .then(res => console.log(res))
                    .catch(this.handleError);
  }

  post(formData: FormData, user: string, pw: string): Promise<Image> {
    let options = this.createOptions(user, pw);
    console.log('we will have a post!');
    console.log(formData.get('localImage'));
    console.log(formData.get('fileUrl'));
    console.log(formData.get('des'));
    return this.http.post(this.imageUrl, formData, options)
                    .toPromise()
                    .then(res => res.json() as Image)
                    .catch(this.handleError);
  }

  deleteImage(id: number, user: string, pw: string): Promise<void> {
    let options = this.createOptions(user, pw);
    const url = `${this.imageUrl}${id}/` + '?format=json';
    console.log(url)
    return this.http.delete(url, options)
            .toPromise()
            .then(() => null)  // 什么也不返回
            .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error);
  }
}
