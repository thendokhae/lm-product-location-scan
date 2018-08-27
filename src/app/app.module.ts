import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { CustomModalPage } from "../pages/custom-modal/custom-modal";

import { ProductViewPage } from "../pages/product-view/product-view";
import { ScannedLocationPage } from "../pages/scanned-location/scanned-location";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ZBar } from "@ionic-native/zbar";
import { Camera } from "@ionic-native/camera";
import { ServiceProvider } from "../providers/service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ProductAddPage } from "../pages/product-add/product-add";
import { LocationAddPage } from "../pages/location-add/location-add";
import { ConfirmLocationPage } from "../pages/confirm-location/confirm-location";
import { ProductAddModalPage } from "../pages/product-add-modal/product-add-modal";
import { ApiIntercepter } from "../providers/api.interceptor";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProductViewPage,
    CustomModalPage,
    ScannedLocationPage,
    LocationAddPage,
    ProductAddPage,
    ConfirmLocationPage,
    ProductAddModalPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      navExitApp: false,
      pageTransition: "md-transition"
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ZBar,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter,
      multi: true
    },
    ServiceProvider
  ],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProductViewPage,
    CustomModalPage,
    ScannedLocationPage,
    ProductAddPage,
    LocationAddPage,
    ConfirmLocationPage,
    ProductAddModalPage
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
