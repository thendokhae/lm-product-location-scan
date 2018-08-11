import { Location } from "./location";

export class Product {
  public product_location: Location = new Location();
  public product_locations: Array<Location> = new Array();
  public id: number = 0;
  public sku_code: string = "";
  public dpt: number = 0;
  public sub_d: number = 0;
  public sd_name: string = "";
  public type: number = 0;
  public t_name: string = "";
  public sub_t: number = 0;
  public st_name: string = "";
  public family: string = "";
  public designation: string = "";
  public nb_carc: number = 0;
  public ean_code: string = "";
  public quality_level: string = "";
  public supplier: string = "";
  public created_at: string = "";
  public updated_at: string = "";
  public price: number = null;
  public image_url: string = "";
  public total_display_units: number = 0;
}
