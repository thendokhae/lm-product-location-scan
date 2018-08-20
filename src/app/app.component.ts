import { Component, ViewChild } from "@angular/core";
import {
  Nav,
  Platform,
  ModalController,
  LoadingController
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { ProductViewPage } from "../pages/product-view/product-view";
import { ScannedLocationPage } from "../pages/scanned-location/scanned-location";
// import { ProductAddPage } from "../pages/product-add/product-add";
import { ServiceProvider } from "../providers/service";
import { CustomModalPage } from "../pages/custom-modal/custom-modal";

@Component({
  templateUrl: "app.html",
  styles: ["app.scss"]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  productCode: string = "";
  loading: any = null;

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public service: ServiceProvider,
    private zbar: ZBar,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Product Search", component: HomePage },
      { title: "Profile", component: HomePage },
      { title: "Logout", component: LoginPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString("#5DA913");
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === "Product Search") {
      this.scanItem();
    } else {
      this.nav.setRoot(page.component);
    }
  }

  scanItem() {
    this.productCode = "";
    let options: ZBarOptions = {
      text_title: "SCAN",
      text_instructions: "",
      drawSight: false
    };

    this.zbar
      .scan(options)
      .then(result => {
        console.log("scanned code", result); // Scanned code
        this.showLoading();
        this.productCode = result;
        this.service.getProductTypeByCode(this.productCode).subscribe(
          data => {
            if (data.code_type === "PRODUCT_LOCATION") {
              this.service.getLocationByCode(this.productCode).subscribe(
                data => {
                  this.dismissLoading();
                  if (data != null && data.id != null) {
                    this.nav.push(ScannedLocationPage, {
                      code: this.productCode
                    });
                  } else {
                    let modal = this.modalCtrl.create(CustomModalPage, {
                      buttonText: "TRY AGAIN",
                      message: "Location not found",
                      title: "SCAN UNSUCCESSFUL!"
                    });
                    modal.present();
                  }
                },
                error => {
                  this.dismissLoading();
                  console.log("error " + error);
                  let modal = this.modalCtrl.create(CustomModalPage, {
                    buttonText: "TRY AGAIN",
                    message: "Please check your network connection",
                    title: "NETWORK ERROR!"
                  });
                  modal.present();
                }
              );
            } else if (data.code_type === "PRODUCT") {
              this.service.getProductByCode(this.productCode).subscribe(
                data => {
                  this.dismissLoading();
                  if (data != null && data.id != null) {
                    this.nav.push(ProductViewPage, { id: data.id });
                  } else {
                    this.productCode = "";
                  }
                },
                error => {
                  this.dismissLoading();
                  console.log("error " + error);
                  let modal = this.modalCtrl.create(CustomModalPage, {
                    buttonText: "TRY AGAIN",
                    message: "Item has not been added to the system",
                    title: "SCAN UNSUCCESSFUL!"
                  });
                  modal.present();
                }
              );
            } else {
              this.dismissLoading();
              let modal = this.modalCtrl.create(CustomModalPage, {
                buttonText: "TRY AGAIN",
                message: "Item has not been added to the system",
                title: "SCAN UNSUCCESSFUL!"
              });
              modal.present();
            }
          },
          error => {
            // console.log(error);
            this.dismissLoading();
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "TRY AGAIN",
              message: "Please check your network connection",
              title: "NETWORK ERROR!"
            });
            modal.present();
          }
        );
      })
      .catch(error => {
        console.log("error " + error); // Error message
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "TRY AGAIN",
          message: "Barcode unreadable",
          title: "SCAN UNSUCCESSFUL!"
        });
        modal.present();
      });
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "",
        showBackdrop: false,
        cssClass: "my-loading-class"
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
