import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { Observable } from 'rxjs/Observable';
import { Product } from "../models/product";
import "rxjs/add/operator/map";

@Injectable()
export class ServiceProvider {
  baseUrl: string =
    // "http://productlocator.stg.demo2.confidential.co.za/api/v1/docs/api/v1/";
    "http://productlocator.stg.demo2.confidential.co.za/api/v1/"

  constructor(public http: HttpClient) {
    console.log("Hello ServiceProvider Provider");
  }

  login(username: string, password: string) {
    const headers = new HttpHeaders().set("content-type", "application/json");

    const body = { username, password };

    return this.http
      .post<any>(this.baseUrl + "login", body, { headers })
      .map(user => {
        // login successful if there's a token in the response
        if (user && user.token) {
          // store user token in local storage to keep user logged in between page refreshes
          localStorage.setItem("activeToken", JSON.stringify(user));
        }

        return user;
      });
  }

  getProductByCode(code: string) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get<Product>(this.baseUrl + "product/find?q=" + code, { headers })
      // .map(product => {
      //   // return  product;
      //   let p: Product;
      //   p = {
      //     ...product
      //   }
      //   console.log(`[Svc->GetProductByCode()]:: ${JSON.stringify(p)}`);
      //   return p;
      // });
  }

  getProductTypeByCode(code: string) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get<any>(this.baseUrl + "tools/codetype/?lookup_code=" + code, { headers })
      // .map(product => {
      //   // return  product;
      //   let p: Product;
      //   p = {
      //     ...product
      //   }
      //   console.log(`[Svc->getProductTypeByCode()]:: ${JSON.stringify(p)}`);
      //   return p;
      // });
  }

  getProductsInLocation(code: string) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get<any>(
        this.baseUrl + "productlocation/products?location_code=" + code, { headers })
      // .map(product => {
      //   // return  product;
      //   let p: Product;
      //   p = {
      //     ...product
      //   }
      //   console.log(`[Svc->getProductsInLocation()]:: ${JSON.stringify(p)}`);
      //   return p;
      // });
  }

  getLocationByCode(code: string) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    console.log(`GetLocationByCode token:: ${JSON.stringify(token)}`)
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get<any>(this.baseUrl + "productlocation/find?location_code=" + code, { headers })
      // .map(product => {
      //   if (!product) console.log('No product: ', JSON.stringify(product));
      //   console.log(`[Svc->GetLocationBycode]:: ${JSON.stringify(product)}`);
      //   return product;
      // });
  }

  getProductById(id: number) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get<Product>(this.baseUrl + "product/" + id, { headers })
      // .map(product => {
      //   // return  product;
      //   let p: Product;
      //   p = {
      //     ...product
      //   }
      //   console.log(`[Svc->getProductById()]:: ${JSON.stringify(p)}`);
      //   return p;
      // });
      
  }

  updateProduct(product: Product) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .put(this.baseUrl + "product/" + product.id, product, { headers });
    // .map(product => {
    //   return product;
    // });
  }

  addProduct(product: Product) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .post(this.baseUrl + "product", product, { headers });
    // .map(product => {
    //   return product;
    // });
  }

  deleteProductById(product: Product) {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http.delete(this.baseUrl + "product/" + product.id, { headers });
  }

  logout() {
    // remove token from local storage to log user out
    localStorage.removeItem("activeToken");
  }

  getAllDepartments() {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get(this.baseUrl + "productlocation/lists?field_name=grid_no", { headers });
    // .map(product => {
    //   return product;
    // });
  }

  getAllIsles() {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get(this.baseUrl + "productlocation/lists?field_name=isle_no", { headers });
    // .map(product => {
    //   return product;
    // });
  }

  getAllHeights() {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get(this.baseUrl + "productlocation/lists?field_name=height", { headers });
    // .map(product => {
    //   return product;
    // });
  }

  getAllShelves() {
    var token = JSON.parse(localStorage.getItem("activeToken"));
    var headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token.token
    );
    return this.http
      .get(this.baseUrl + "productlocation/lists?field_name=shelf_no", { headers });
    // .map(product => {
    //   return product;
    // });
  }
}
