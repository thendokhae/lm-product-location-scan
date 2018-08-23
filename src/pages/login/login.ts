import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ModalController
} from "ionic-angular";
import { HomePage } from "../home/home";
import { CustomModalPage } from "../custom-modal/custom-modal";
import { ServiceProvider } from "../../providers/service";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  username: string = "";
  password: string = "";

  login() {
    this.showLoading();
    this.service.login(this.username, this.password).subscribe(
      data => {
        this.dismissLoading();
        this.navCtrl.setRoot(HomePage);
      },
      error => {
        this.username = "";
        this.password = "";
        this.showAlert("Login Failed!", "Incorrect login credentials entered.");
        this.dismissLoading();
      }
    );
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
    let modal = this.modalCtrl.create(CustomModalPage, {
      buttonText: "TRY AGAIN",
      message: "Incorrect login credentials entered.",
      title: "LOGIN FAILED"
    });
    modal.present();
  }
}
