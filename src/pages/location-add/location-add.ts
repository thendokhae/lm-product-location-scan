import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  LoadingController
} from "ionic-angular";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { Location } from "../../models/location";
import { Product } from "../../models/product";
import { ConfirmLocationPage } from "../confirm-location/confirm-location";
import { ProductViewPage } from "../product-view/product-view";
import { ServiceProvider } from "../../providers/service";

/**
 * Generated class for the LocationAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-location-add",
  templateUrl: "location-add.html",
  styles: ["location-add.scss"]
})
export class LocationAddPage {
  scan: string = "assets/imgs/scan.png";
  newLocation: Location = new Location();
  designation: string = "";
  title: string = "";
  buttonLabel: string = "";
  currentProduct: Product = new Product();
  loading: any = null;
  grids: any = [];
  isles: any = [];
  shelves: any = [];
  heights: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    private zbar: ZBar
  ) {
    this.service.getProductById(this.navParams.get("id")).subscribe(data => {
      if (data) {
        this.currentProduct = data;
      }
    });
    this.service.getAllDepartments().subscribe(
      data => {
        console.log(data);
        this.grids = data;
      },
      error => {
        console.log(error);
      }
    );

    this.service.getAllIsles().subscribe(
      data => {
        console.log(data);
        this.isles = data;
      },
      error => {
        console.log(error);
      }
    );

    this.service.getAllHeights().subscribe(
      data => {
        this.heights = data;
      },
      error => {
        console.log(error);
      }
    );

    this.service.getAllShelves().subscribe(
      data => {
        this.shelves = data;
      },
      error => {
        console.log(error);
      }
    );

    this.designation = this.navParams.get("designation");
    this.buttonLabel = this.navParams.get("buttonLabel");
    this.title = this.navParams.get("title");
    this.newLocation.grid_no = this.navParams.get("gridNo");
    this.newLocation.isle_no = this.navParams.get("isleNo");
    this.newLocation.shelf_no = this.navParams.get("shelfNo");
    this.newLocation.id = this.navParams.get("locationId");
    this.newLocation.total_display_units = this.navParams.get(
      "totalDisplayUnits"
    );
    this.newLocation.height = this.navParams.get("height");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LocationAddPage");
  }

  addLocation() {
    this.showLoading();
    // this.newProduct.id = null;
    this.newLocation.id = this.navParams.get("locationId");
    if (this.title === "Edit Location") {
      this.currentProduct.product_locations.forEach(element => {
        if (element.id === this.newLocation.id) {
          element.grid_no = this.newLocation.grid_no;
          element.height = this.newLocation.height;
          element.isle_no = this.newLocation.isle_no;
          element.shelf_no = this.newLocation.shelf_no;
        }
      });
    } else {
      if (this.newLocation.id == undefined) {
        this.newLocation.id = null;
      }
      this.currentProduct.product_location = this.newLocation;
      this.currentProduct.product_locations.push(
        this.currentProduct.product_location
      );
    }
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

  scanLocation() {
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
        this.service.getLocationByCode(result).subscribe(
          data => {
            this.dismissLoading();
            if (data) {
              this.newLocation.grid_no = data.grid_no;
              this.newLocation.isle_no = data.isle_no;
              this.newLocation.height = data.height;
              this.newLocation.shelf_no = data.shelf_no;
              this.newLocation.id = data.id;
              let modal = this.modalCtrl.create(ConfirmLocationPage, {
                id: this.currentProduct.id,
                designation: this.designation,
                title: this.title,
                totalDisplayUnits: this.newLocation.total_display_units,
                locationId: this.newLocation.id,
                isleNo: this.newLocation.isle_no,
                gridNo: this.newLocation.grid_no,
                shelfNo: this.newLocation.shelf_no,
                height: this.newLocation.height
              });
              modal.present();
            }
          },
          error => {
            this.dismissLoading();
          }
        );
      })
      .catch(error => {
        let modal = this.modalCtrl.create(ConfirmLocationPage, {
          id: this.currentProduct.id,
          designation: this.designation,
          title: this.title,
          totalDisplayUnits: this.newLocation.total_display_units,
          locationId: this.newLocation.id,
          isleNo: this.newLocation.isle_no,
          gridNo: this.newLocation.grid_no,
          shelfNo: this.newLocation.shelf_no,
          height: this.newLocation.height
        });
        modal.present();
        console.log(error); // Error message
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

  dismiss() {
    this.navCtrl.pop();
  }
}
