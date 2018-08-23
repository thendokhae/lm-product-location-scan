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
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(HomePage);
    }, 1);

    let l1: Location = { id: 29457, grid_no: 'alsk39a', height: '10m', location: 'Moscow', isle_no: 'No1', shelf_no: 'Shelf1' };
    let p1: Product = {
      created_at: Date.now().toString(),
      sku_code: 'TG9936HH',
      product_locations: [l1],
      designation: 'Some Destination',
      dpt: 1,
      family: 'Computers',
      quality_level: 'high',
      supplier: 'Vladimir Ovsyukov',
      nb_carc: 29,
      sd_name: 'Sd name',
      st_name: 'St name',

      ean_code: 'ke937kd9',
      id: 994722309,
      price: 39,
      product_location: l1
    }
    // let p2: Product, p3: Product, p4: Product, p5: Product = p1;
    let p2: Product = { ...p1 };
    let p3: Product = { ...p1 };
    
    this.productList.push(p1);
    this.productList.push(p2);
    this.productList.push(p3);
    // this.productList.push(p4)
    // this.productList.push(p5)
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ScannedLocationPage");
    let locCode = this.navParams.get("code");
    console.log(`[ScannedLocationPage->ionViewDidLoad]:: locCode -- ${locCode}`)
    // this.service
    //   .getProductsInLocation(locCode)
    //   .subscribe(data => {
    //     console.log(`[ScannedLocationPage->ionViewDidLoad]:: svc->GetProductsInThisLoc -- ${JSON.stringify(data)}`)
    //     this.selectedLocation = data.location;
    //     if (data.rows.length > 0) {
    //       this.productList = data.rows;
    //     }
    //   });
 
  }

  addProduct() {
    console.log("[ScannedLocationPage-->AddProduct()] clicked!");
    // this.changeDetector.detectChanges();
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
      .then(productCode => {
        console.log("[ScannedLocationPage->scanItem()]:: scanned prodCode -- ", productCode);
        this.showLoading();
        this.getProductByCode(productCode);
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

  getProductByCode(productCode) {
    this.service.getProductByCode(productCode).subscribe(
      data => {
        this.dismissLoading();
        console.log("[ScannedLocationPage->getProductByCode()]:: product -- ", JSON.stringify(data));
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
