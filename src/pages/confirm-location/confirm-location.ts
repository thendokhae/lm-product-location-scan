import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { Product } from "../../models/product";
import { Location } from "../../models/location";
import { ServiceProvider } from "../../providers/service";
import { ProductViewPage } from "../../pages/product-view/product-view";

/**
 * Generated class for the ConfirmLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-confirm-location",
  templateUrl: "confirm-location.html",
  styles: ["confirm-location.scss"]
})
export class ConfirmLocationPage {
  title: string = "";
  isleNo: string = "";
  gridNo: string = "";
  height: string = "";
  shelfNo: string = "";
  totalDisplayUnits: number = 0;
  designation: string = "";
  departmentNo: number = 0;
  currentProduct: Product = new Product();
  loading: any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController
  ) {
    debugger;
    this.service.getProductById(this.navParams.get("id")).subscribe(data => {
      if (data) {
        this.currentProduct = data;
      }
    });
    this.title = this.navParams.get("title");
    this.isleNo = this.navParams.get("isleNo");
    this.gridNo = this.navParams.get("gridNo");
    this.height = this.navParams.get("height");
    this.shelfNo = this.navParams.get("shelfNo");
    this.totalDisplayUnits = this.navParams.get("totalDisplayUnits");
    this.designation = this.navParams.get("designation");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ConfirmLocationPage");
  }

  correct() {
    this.showLoading();
    // this.newProduct.id = null;
    let location: Location = new Location();
    location.grid_no = this.gridNo;
    location.height = this.height;
    location.shelf_no = this.shelfNo;
    location.isle_no = this.isleNo;
    location.total_display_units = this.totalDisplayUnits;
    location.id = this.navParams.get("locationId");
    if (this.title === "Edit Location") {
      this.currentProduct.product_locations.forEach(element => {
        if (element.id === location.id) {
          element.grid_no = location.grid_no;
          element.height = location.height;
          element.isle_no = location.isle_no;
          element.shelf_no = location.shelf_no;
        }
      });
    } else {
      if (location.id == undefined) {
        location.id = null;
      }
      this.currentProduct.product_location = location;
      this.currentProduct.product_locations.push(
        this.currentProduct.product_location
      );
    }
    debugger;
    this.service.updateProduct(this.currentProduct).subscribe(
      data => {
        this.navCtrl.pop();
        this.dismissLoading();
        this.navCtrl.push(ProductViewPage, { id: data["id"] });
      },
      error => {
        this.navCtrl.pop();
        this.dismissLoading();
      }
    );
  }

  inCorrect() {
    this.navCtrl.pop();
  }

  dismiss() {
    this.navCtrl.pop();
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: ""
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
