import { Component, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  Platform
} from "ionic-angular";
// import { ProductAddPage } from "../product-add/product-add";
import { Location } from "../../models/location";
import { Product } from "../../models/product";
import { HomePage } from "../home/home";
import { ServiceProvider } from "../../providers/service";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { CustomModalPage } from "../custom-modal/custom-modal";
// import { ProductViewPage } from "../product-view/product-view";

@Component({
  selector: "page-scanned-location",
  templateUrl: "scanned-location.html",
  styles: ["scanned-location.scss"]
})
export class ScannedLocationPage {
  selectedLocation: Location = null;
  scan: string = "assets/imgs/scan.png";
  productList: Array<Product> = new Array();
  loading: any = null;
  newProduct: Product = new Product();
  existingProductLocations: any[] = [];
  scanLocationImg: string = "assets/imgs/scan-qr.png";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public zbar: ZBar,
    private platform: Platform,
    public changeDetector: ChangeDetectorRef
  ) {
    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(HomePage);
    }, 1);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ScannedLocationPage");
    this.service
      .getProductsInLocation(this.navParams.get("code"))
      .subscribe(data => {
        this.selectedLocation = data.location;
        if (data.rows.length > 0) {
          this.productList = data.rows;
        }
      });
  }

  addProduct() {
    console.log("addProduct");
    this.changeDetector.detectChanges();
    this.scanItem();
  }

  scanItem() {
    let options: ZBarOptions = {
      text_title: "SCAN",
      text_instructions: "",
      drawSight: false,
      flash: "off"
    };

    this.zbar
      .scan(options)
      .then(result => {
        console.log("scanned code", result); // Scanned code
        this.showLoading();
        this.getProductByCode(result);
      })
      .catch(error => {
        this.dismissLoading();
        console.log(error); // Error message
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            message: "Error occured while scanning",
            title: "SCAN UNSUCCESSFUL!"
          });
          modal.present();
        }
      });
  }

  getProductByCode(code) {
    this.service.getProductByCode(code).subscribe(
      data => {
        this.dismissLoading();
        if (data) {
          this.newProduct.dpt = data.dpt;
          this.newProduct.designation = data.designation;
          this.newProduct.price = data.price;
          this.newProduct.sku_code = data.sku_code;
          this.newProduct.ean_code = data.ean_code;
          this.newProduct.id = data.id;
          this.newProduct.product_locations = data.product_locations;
          this.newProduct.product_locations.push(this.selectedLocation);
          this.updateProduct();
        } else {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            message: "Item has not been added to the system",
            from: "product",
            title: "ITEM HAS NOT BEEN ADDED TO THE SYSTEM"
          });
          modal.present();
        }
      },
      error => {
        this.dismissLoading();
      }
    );
  }

  updateProduct() {
    this.service.updateProduct(this.newProduct).subscribe(
      data => {
        this.dismissLoading();
        this.navCtrl.push(ScannedLocationPage, {
          sku_code: data["sku_code"],
          code: this.navParams.get("code")
        });
      },
      error => {
        this.dismissLoading();
        // this.showAlert("Save Failed!", "Could not save product");
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "OK",
          message: "Could not save product.",
          title: "UPDATE FAILED!"
        });
        modal.present();
      }
    );
  }

  editProduct(product: Product) {
    // this.navCtrl.push(ProductAddPage, {
    //   id: product.id,
    //   designation: product.designation,
    //   ean_code: product.ean_code,
    //   title: "Edit Product",
    //   buttonLabel: "UPDATE",
    //   gridNo: this.selectedLocation.grid_no,
    //   isleNo: this.selectedLocation.isle_no,
    //   shelfNo: this.selectedLocation.shelf_no,
    //   totalDisplayUnits: this.selectedLocation.total_display_units,
    //   locationId: this.selectedLocation.id,
    //   locationCode: this.navParams.get("code"),
    //   height: this.selectedLocation.height
    // });
    // modal.present();
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

  deleteProduct(product: Product) {
    this.showLoading();
    this.service.deleteProductById(product).subscribe(
      data => {
        this.dismissLoading();
        debugger;
        this.service
          .getProductsInLocation(this.navParams.get("code"))
          .subscribe(data => {
            this.selectedLocation = data.location;
            if (data.rows.length > 0) {
              this.productList = data.rows;
            } else {
              this.productList = [];
            }
          });
      },
      error => {
        this.dismissLoading();
        this.service
          .getProductsInLocation(this.navParams.get("code"))
          .subscribe(data => {
            this.selectedLocation = data.location;
            if (data.rows.length > 0) {
              this.productList = data.rows;
            } else {
              this.productList = [];
            }
          });
      }
    );
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
