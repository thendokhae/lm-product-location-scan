import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  ModalController,
  MenuController
} from "ionic-angular";
// import { ProductSearchPage } from "../product-search/product-search";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { ProductViewPage } from "../product-view/product-view";
import { ScannedLocationPage } from "../scanned-location/scanned-location";
// import { ProductAddPage } from "../product-add/product-add";
import { ServiceProvider } from "../../providers/service";
import { LoginPage } from "../login/login";
import { CustomModalPage } from "../custom-modal/custom-modal";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  styles: ["home.scss"]
})
export class HomePage {
  logo = "assets/imgs/leroy-merlin.png";
  scan = "assets/imgs/scan.png";
  // scanLocationImg: string = "assets/imgs/scan-qr.png";
  // scanProductImg: string = "assets/imgs/scan-barcode.png";
  scanLocationImg = "assets/imgs/Asset 2@3x.png";
  scanProductImg = "assets/imgs/Asset 3@3x.png";
  screenMode = "scanner";
  productCode = "";
  productNotFound = false;
  loading: any = null;

  constructor(
    public navCtrl: NavController,
    private zbar: ZBar,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(true, "login");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HomePage");
    this.screenMode = "scanner";
    // this.productNotFound = false;
  }

  scanLocation() {
    this.productCode = "";
    let options: ZBarOptions = {
      text_title: "SCAN",
      text_instructions: "",
      drawSight: false
    };

    this.zbar
      .scan(options)
      .then(result => {
        console.log("scanned Location code", result); // Scanned code
        this.showLoading();
        this.productCode = result;
        this.service.getLocationByCode(this.productCode).subscribe(
          data => {
            console.log(`[Home]->ScanLocation:: ${JSON.stringify(data)}`)
            this.dismissLoading();
            if (data != null && data.id != null) {
              this.navCtrl.push(ScannedLocationPage, {
                code: this.productCode
              });
            } else {
              let modal = this.modalCtrl.create(CustomModalPage, {
                buttonText: "OK",
                from: "location",
                message: "Location not found",
                title: "LOCATION NOT FOUND!"
              });
              modal.present();
            }
          },
          error => {
            this.dismissLoading();
            console.log("error " + error);
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "OK",
              from: "location",
              message: "Location not found",
              title: "LOCATION NOT FOUND!"
            });
            modal.present();
          }
        );
      })
      .catch(error => {
        console.log("error " + error); // Error message
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            from: "location",
            message: "Barcode unreadable",
            title: "BARCODE UNREADABLE!"
          });
          modal.present();
        }
      });
  }

  scanProduct() {
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
        this.service.getProductByCode(this.productCode).subscribe(
          data => {
            this.dismissLoading();
            console.log(`Scaned product:: ${JSON.stringify(data)}`)
            if (data != null && data.id != null) {
              this.navCtrl.push(ProductViewPage, { id: data.id });
            } else {
              this.productCode = "";
              this.screenMode = "enterManually";
            }
          },
          error => {
            this.dismissLoading();
            console.log("Scanning product failed::  " + error);
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "OK",
              from: "product",
              message: "Item has not been added to the system",
              title: "ITEM HAS NOT BEEN ADDED TO THE SYSTEM!"
            });
            modal.present();
          }
        );
      })
      .catch(error => {
        console.log("Scanning product failed " + error); // Error message
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            from: "product",
            message: "Barcode unreadable",
            title: "BARCODE UNREADABLE!"
          });
          modal.present();
        }
      });
  }

  enterManually() {
    this.screenMode = "enterManually";
  }

  cancel() {
    this.screenMode = "scanner";
  }

  searchLocation() {
    if (this.productCode.length == 0) {
      console.log(`SearchLocation return , no productCode:: ${this.productCode} `);
      return;
    }
    this.showLoading();
    
    console.log(`SearchLocation , starting search with product code - ${this.productCode} `);
    this.service.getProductByCode(this.productCode.toString()).subscribe(
      data => {
        this.dismissLoading();
        console.log(`SearchLocation:: ${JSON.stringify(data)}`);
        if (data != null && data.id != null) {
          this.navCtrl.push(ProductViewPage, { id: data.id });
        } else {
          this.productCode = "";
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            message: "Please enter the LM again",
            title: "PRODUCT NOT FOUND!"
          });
          modal.present();
        }
      },
      error => {
        console.log('SearchLocation error:: ', error);
        this.dismissLoading();
        this.productCode = "";
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "OK",
          message: "Please enter the LM again",
          title: "PRODUCT NOT FOUND!"
        });
        modal.present();
      }
    );
  }

  addNow() {
    this.screenMode = "scanner";
    // this.navCtrl.push(ProductAddPage, { id: null, ean_code: this.productCode });
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: "Loading",
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

  logOut() {
    this.navCtrl.setRoot(LoginPage);
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  openProductSearch() {
    console.log("openProductSearch");
  }
}
