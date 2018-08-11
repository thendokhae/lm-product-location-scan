import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { CustomModalPage } from "../pages/custom-modal/custom-modal";
import { ProductAddModalPage } from "../pages/product-add-modal/product-add-modal";
// import { ProductSearchPage } from "../pages/product-search/product-search";
import { ConfirmLocationPage } from "../pages/confirm-location/confirm-location";
import { ProductViewPage } from "../pages/product-view/product-view";
import { ProductAddPage } from "../pages/product-add/product-add";
import { ScannedLocationPage } from "../pages/scanned-location/scanned-location";
import { LocationAddPage } from "../pages/location-add/location-add";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ZBar } from "@ionic-native/zbar";
import { Camera } from "@ionic-native/camera";
import { ServiceProvider } from "../providers/service";
import { HttpModule } from "@angular/http";
import { HttpClientModule, HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProductViewPage,
    ProductAddPage,
    CustomModalPage,
    ScannedLocationPage,
    LocationAddPage,
    ConfirmLocationPage,
    ProductAddModalPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      navExitApp: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProductViewPage,
    ProductAddPage,
    CustomModalPage,
    ScannedLocationPage,
    LocationAddPage,
    ConfirmLocationPage,
    ProductAddModalPage
  ],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    ZBar,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpModule,
    HttpClient,
    ServiceProvider
  ]
})
export class AppModule {}
