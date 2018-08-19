import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ModalController
} from "ionic-angular";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { LoginPage } from "../login/login";
import { ServiceProvider } from "../../providers/service";
import { ScannedLocationPage } from "../scanned-location/scanned-location";
import { ProductViewPage } from "../product-view/product-view";
/**
 * Generated class for the CustomModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-custom-modal",
  templateUrl: "custom-modal.html",
  styles: ["custom-modal.scss"]
})
export class CustomModalPage {
  buttonText: string = "";
  message: string = "";
  title: string = "";
  from: string = "";
  productCode: string = "";
  loading: any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private zbar: ZBar,
    private service: ServiceProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.buttonText = this.navParams.get("buttonText");
    this.message = this.navParams.get("message");
    this.title = this.navParams.get("title");
    this.from = this.navParams.get("from");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CustomModalPage");
  }

  dismiss() {
    debugger;
    if (this.buttonText.toLowerCase() === "try again") {
      if (this.from === "location") {
        this.scanLocation();
      } else if (this.from === "product") {
        this.scanProduct();
      }
    }
    this.navCtrl.pop();
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
              buttonText: "TRY AGAIN",
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
            buttonText: "TRY AGAIN",
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
            if (data != null && data.id != null) {
              this.navCtrl.push(ProductViewPage, { id: data.id });
            } else {
              this.productCode = "";
            }
          },
          error => {
            this.dismissLoading();
            console.log("error " + error);
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "TRY AGAIN",
              from: "product",
              message: "Item has not been added to the system",
              title: "ITEM HAS NOT BEEN ADDED TO THE SYSTEM!"
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
            from: "product",
            message: "Barcode unreadable",
            title: "BARCODE UNREADABLE!"
          });
          modal.present();
        }
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
