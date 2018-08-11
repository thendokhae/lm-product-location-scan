import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ModalController,
  AlertController
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ZBar, ZBarOptions } from "@ionic-native/zbar";
import { Product } from "../../models/product";
import { Location } from "../../models/location";
import { ProductViewPage } from "../product-view/product-view";
import { ServiceProvider } from "../../providers/service";
import { ProductAddModalPage } from "../product-add-modal/product-add-modal";
import { CustomModalPage } from "../custom-modal/custom-modal";
import { ScannedLocationPage } from "../scanned-location/scanned-location";

/**
 * Generated class for the ProductAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: "page-product-add",
  templateUrl: "product-add.html"
})
export class ProductAddPage {
  image: string = "assets/imgs/camera.png";
  productList: Array<Product> = Array();
  newProduct: Product = new Product();
  loading: any = null;
  scan: string = "assets/imgs/scan.png";
  isleNo: string = "";
  gridNo: string = "";
  height: string = "";
  shelfNo: string = "";
  locationId: string = null;
  locationCode: string = null;
  existingProductLocations: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private zbar: ZBar,
    public alertCtrl: AlertController
  ) {
    this.isleNo = this.navParams.get("isleNo");
    this.gridNo = this.navParams.get("gridNo");
    this.height = this.navParams.get("height");
    this.shelfNo = this.navParams.get("shelfNo");
    if (this.navParams.get("locationId")) {
      this.locationId = this.navParams.get("locationId");
    }

    if (this.navParams.get("locationCode")) {
      this.locationCode = this.navParams.get("locationCode");
    }
    if (this.navParams.get("id")) {
      this.showLoading();
      this.service.getProductById(this.navParams.get("id")).subscribe(
        data => {
          if (data.product_locations.length > 0) {
            data.product_location = data.product_locations[0];
          } else {
            data.product_location = new Location();
            data.product_location.id = null;
            let modal = this.modalCtrl.create(CustomModalPage, {
              buttonText: "TRY AGAIN",
              message: "Item has not been added to the system",
              title: "SCAN UNSUCCESSFUL!"
            });
            modal.present();
          }
          this.newProduct = data;
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss();
          let modal = this.modalCtrl.create(CustomModalPage, {
            buttonText: "TRY AGAIN",
            message: "Item has not been added to the system",
            title: "SCAN UNSUCCESSFUL!"
          });
          modal.present();
        }
      );
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductAddPage");
  }

  addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = "data:image/jpeg;base64," + imageData;
        this.image = base64Image;
        this.newProduct.image_url = this.image;
      },
      err => {
        // Handle error
      }
    );
  }

  addProduct() {
    this.service.getProductById(this.newProduct.id).subscribe(data => {
      if (data) {
        this.existingProductLocations = data.product_locations;
      }
    });
    if (!this.newProduct.product_location) {
      this.newProduct.product_location.id = null;
    }

    if (this.existingProductLocations.length) {
      this.newProduct.product_locations = this.existingProductLocations;
    }
    this.newProduct.product_locations.push(this.newProduct.product_location);

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

  scanProduct() {
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
        this.service.getProductByCode(result).subscribe(
          data => {
            this.dismissLoading();
            if (data) {
              this.newProduct.dpt = data.dpt;
              this.newProduct.designation = data.designation;
              this.newProduct.price = data.price;
              this.newProduct.sku_code = data.sku_code;
              this.newProduct.ean_code = data.ean_code;
              this.newProduct.id = data.id;
              this.addProduct();
            } else {
              let modal = this.modalCtrl.create(CustomModalPage, {
                buttonText: "TRY AGAIN",
                message: "Item has not been added to the system",
                title: "SCAN UNSUCCESSFUL!"
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
        console.log(error); // Error message
        let modal = this.modalCtrl.create(CustomModalPage, {
          buttonText: "TRY AGAIN",
          message: "Error occured while scanning",
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

  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
  }
}
