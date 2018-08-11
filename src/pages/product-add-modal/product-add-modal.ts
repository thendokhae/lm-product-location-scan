import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { Product } from "../../models/product";
import { ScannedLocationPage } from "../scanned-location/scanned-location";
import { ServiceProvider } from "../../providers/service";

/**
 * Generated class for the ProductAddModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-product-add-modal",
  templateUrl: "product-add-modal.html",
  styles: ["product-add-modal.scss"]
})
export class ProductAddModalPage {
  newProduct: Product = new Product();
  loading: any = null;
  existingProductLocations: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.newProduct.dpt = this.navParams.get("department");
    this.newProduct.designation = this.navParams.get("designation");
    this.newProduct.sku_code = this.navParams.get("sku_code");
    this.newProduct.price = this.navParams.get("price");
    this.newProduct.product_location.grid_no = this.navParams.get("gridNo");
    this.newProduct.product_location.isle_no = this.navParams.get("isleNo");
    this.newProduct.product_location.height = this.navParams.get("height");
    this.newProduct.product_location.shelf_no = this.navParams.get("shelfNo");
    this.newProduct.product_location.id = this.navParams.get("locationId");
    this.newProduct.ean_code = this.navParams.get("ean_code");
    if (this.navParams.get("productId")) {
      this.newProduct.id = this.navParams.get("productId");
      this.service.getProductById(this.newProduct.id).subscribe(data => {
        if (data) {
          this.existingProductLocations = data.product_locations;
        }
      });
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductAddModalPage");
  }

  dismiss() {
    this.navCtrl.pop();
  }

  correct() {
    this.showLoading();
    // this.newProduct.id = null;
    if (!this.newProduct.product_location) {
      this.newProduct.product_location.id = null;
    }

    if (this.existingProductLocations.length) {
      this.newProduct.product_locations = this.existingProductLocations;
    }
    this.newProduct.product_locations.push(this.newProduct.product_location);
    this.newProduct.total_display_units = parseInt(
      this.newProduct.total_display_units.toString()
    );
    if (this.newProduct.price) {
      this.newProduct.price = parseInt(this.newProduct.price.toString());
    }

    if (this.newProduct.id) {
      this.service.updateProduct(this.newProduct).subscribe(
        data => {
          this.navCtrl.pop();
          this.dismissLoading();
          this.navCtrl.push(ScannedLocationPage, {
            sku_code: data["sku_code"],
            code: this.navParams.get("locationCode")
          });
        },
        error => {
          this.navCtrl.pop();
          this.dismissLoading();
          this.showAlert("Save Failed!", "Could not save product");
        }
      );
    } else {
      this.service.addProduct(this.newProduct).subscribe(
        data => {
          this.navCtrl.pop();
          this.dismissLoading();
          this.navCtrl.push(ScannedLocationPage, {
            sku_code: data["sku_code"],
            code: this.navParams.get("locationCode")
          });
        },
        error => {
          this.navCtrl.pop();
          this.dismissLoading();
          this.showAlert("Save Failed!", "Could not save product");
        }
      );
    }
  }

  incorrect() {
    this.navCtrl.pop();
  }

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
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
