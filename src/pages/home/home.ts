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
import { ProductAddPage } from "../product-add/product-add";
import { ServiceProvider } from "../../providers/service";
import { LoginPage } from "../login/login";
import { CustomModalPage } from "../custom-modal/custom-modal";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  styles: ["home.scss"]
})
export class HomePage {
  logo: string = "assets/imgs/leroy-merlin.png";
  scan: string = "assets/imgs/scan.png";
  scanLocationImg: string = "assets/imgs/scan-qr.png";
  scanProductImg: string = "assets/imgs/scan-barcode.png";
  screenMode: string = "scanner";
  productCode: string = "";
  productNotFound: boolean = false;
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
    this.productNotFound = false;
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
        console.log("scanned code", result); // Scanned code
        this.showLoading();
        this.productCode = result;
        this.service.getLocationByCode(this.productCode).subscribe(
          data => {
            this.dismissLoading();
            if (data != null && data.id != null) {
              this.navCtrl.push(ScannedLocationPage, {
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
      })
      .catch(error => {
        console.log("error " + error); // Error message
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "TRY AGAIN",
            message: "Barcode unreadable",
            title: "SCAN UNSUCCESSFUL!"
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
            if (data != null && data.id != null) {
              this.navCtrl.push(ProductViewPage, { id: data.id });
            } else {
              this.productCode = "";
              this.screenMode = "enterManually";
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
      })
      .catch(error => {
        console.log("error " + error); // Error message
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "TRY AGAIN",
            message: "Barcode unreadable",
            title: "SCAN UNSUCCESSFUL!"
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
      return;
    }
    this.showLoading();
    this.service.getProductByCode(this.productCode.toString()).subscribe(
      data => {
        this.dismissLoading();
        if (data != null && data.id != null) {
          this.navCtrl.push(ProductViewPage, { id: data.id });
        } else {
          this.productCode = "";
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "TRY AGAIN",
            message: "Please enter the LM again",
            title: "PRODUCT NOT FOUND!"
          });
          modal.present();
        }
      },
      error => {
        this.dismissLoading();
        this.productCode = "";
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "TRY AGAIN",
          message: "Please enter the LM again",
          title: "PRODUCT NOT FOUND!"
        });
        modal.present();
      }
    );
  }

  addNow() {
    this.screenMode = "scanner";
    this.navCtrl.push(ProductAddPage, { id: null, ean_code: this.productCode });
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
