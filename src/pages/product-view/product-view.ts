import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ModalController,
  Platform
} from "ionic-angular";
import { Product } from "../../models/product";
import { Location } from "../../models/location";
// import { ProductAddPage } from "../product-add/product-add";
// import { LocationAddPage } from "../location-add/location-add";
import { HomePage } from "../home/home";
import { ServiceProvider } from "../../providers/service";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { CustomModalPage } from "../custom-modal/custom-modal";
import { ScannedLocationPage } from "../scanned-location/scanned-location";
/**
 * Generated class for the ProductViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-product-view",
  templateUrl: "product-view.html"
})
export class ProductViewPage {
  productList: Array<Product> = new Array();
  selectedProduct: Product = new Product();
  prepopulatedProducts = [
    "6009700243667",
    "6009182696401",
    "6921555507285",
    "6001760005445"
  ];
  screenMode: string = "scanner";
  productNotFound: boolean = false;
  scan: string = "assets/imgs/scan.png";
  cameraImage: string = "assets/imgs/coming_soon.png";
  productCode: string = "";
  loading: any = null;
  newLocation: Location = new Location();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private zbar: ZBar,
    private platform: Platform
  ) {
    if (this.navParams.get("id") !== null) {
      this.showLoading();
      platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(HomePage);
      }, 1);
      this.service.getProductById(this.navParams.get("id")).subscribe(
        data => {
          if (data.product_locations.length > 0) {
            data.product_location = data.product_locations[0];
          } else {
            data.product_location = new Location();
          }
          if (data.image_url === null || data.image_url.length === 0) {
            data.image_url = this.cameraImage;
          }
          this.selectedProduct = data;
          this.dismissLoading();
        },
        error => {
          this.dismissLoading();
        }
      );
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductViewPage");
  }

  populateProducts() {}

  scanItem() {
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
                    this.navCtrl.push(ScannedLocationPage, {
                      code: this.productCode
                    });
                  } else {
                    let modal = this.modalCtrl.create(CustomModalPage, {
                      buttonText: "OK",
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
                    buttonText: "OK",
                    message: "Error occured while scanning",
                    title: "SCAN UNSUCCESSFUL!"
                  });
                  modal.present();
                }
              );
            } else if (data.code_type === "PRODUCT") {
              this.service.getProductByCode(this.productCode).subscribe(
                data => {
                  this.dismissLoading();
                  if (data != null && data.id != null) {
                    this.navCtrl.push(ProductViewPage, { id: data.id });
                  } else {
                    let modal = this.modalCtrl.create(CustomModalPage, {
                      buttonText: "OK",
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
                    buttonText: "OK",
                    message: "Error occured while scanning",
                    title: "SCAN UNSUCCESSFUL!"
                  });
                  modal.present();
                }
              );
            } else {
              this.dismissLoading();
              let modal = this.modalCtrl.create(CustomModalPage, {
                buttonText: "OK",
                message: "Item has not been added to the system",
                title: "SCAN UNSUCCESSFUL!"
              });
              modal.present();
            }
          },
          error => {
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "OK",
              message: "Error occured while scanning",
              title: "SCAN UNSUCCESSFUL!"
            });
            modal.present();
          }
        );
      })
      .catch(error => {
        console.log("error " + error); // Error message
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "OK",
          message: "Error occured while scanning",
          title: "SCAN UNSUCCESSFUL!"
        });
        modal.present();
      });
  }

  enterManually() {
    this.screenMode = "enterManually";
  }

  cancel() {
    this.navCtrl.setRoot(HomePage);
  }

  searchLocation() {
    this.showLoading();
    this.service.getProductByCode(this.productCode).subscribe(
      data => {
        this.dismissLoading();
        if (data.id != null) {
          this.navCtrl.setRoot(ProductViewPage, { id: data.id });
        }
      },
      error => {
        this.dismissLoading();
        this.productNotFound = false;
      }
    );
  }

  updateLocation() {
    this.showLoading();
    let options: ZBarOptions = {
      text_title: "SCAN",
      text_instructions: "",
      drawSight: false
    };

    this.zbar
      .scan(options)
      .then(result => {
        console.log("scanned code", result); // Scanned code
        this.service.getLocationByCode(result).subscribe(
          data => {
            this.dismissLoading();
            if (data) {
              this.newLocation.grid_no = data.grid_no;
              this.newLocation.isle_no = data.isle_no;
              this.newLocation.height = data.height;
              this.newLocation.shelf_no = data.shelf_no;
              this.newLocation.id = data.id;

              this.selectedProduct.product_locations.push(this.newLocation);
              this.service.updateProduct(this.selectedProduct).subscribe(
                data => {
                  // this.navCtrl.pop();
                  this.dismissLoading();
                  this.navCtrl.push(ProductViewPage, { id: data["id"] });
                },
                error => {
                  // this.navCtrl.pop();
                  this.dismissLoading();
                }
              );
            }
          },
          error => {
            this.dismissLoading();
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "OK",
              message: "Error occured while updating product",
              title: "Unable Failed!"
            });
            modal.present();
          }
        );
      })
      .catch(error => {
        console.log(error); // Error message
        this.dismissLoading();
        if (error.toLowerCase() !== "cancelled") {
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "OK",
            from: "location",
            message: "Error occured while scanning",
            title: "SCAN UNSUCCESSFUL!"
          });
          modal.present();
        }
      });
  }

  addNow() {
    // this.navCtrl.push(ProductAddPage, { id: null });
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

  editLocation(location: Location) {
    // let modal = this.modalCtrl.create(LocationAddPage, {
    //   id: this.selectedProduct.id,
    //   designation: this.selectedProduct.designation,
    //   title: "Edit Location",
    //   buttonLabel: "UPDATE",
    //   locationId: location.id,
    //   gridNo: location.grid_no,
    //   isleNo: location.isle_no,
    //   shelfNo: location.shelf_no,
    //   totalDisplayUnits: location.total_display_units,
    //   height: location.height
    // });
    // modal.present();
  }

  deleteLocation(location: Location) {
    this.showLoading();
    this.selectedProduct.product_locations.splice(
      this.selectedProduct.product_locations.indexOf(location),
      1
    );
    this.service.updateProduct(this.selectedProduct).subscribe(data => {
      this.dismissLoading();
      this.navCtrl.setRoot(ProductViewPage, { id: data["id"] });
    });
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
