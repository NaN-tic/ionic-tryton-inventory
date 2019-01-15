import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import { InfiniteList } from '../../ionic-tryton-infinite-list/infinite-list'
import { EncodeJSONRead } from '../../ngx-tryton-json/encode-json-read'
import { TrytonProvider } from '../../ngx-tryton-providers/tryton-provider'

import { Routing } from '../../../pages/routing/routing';

@Component({
  selector: 'location-inventory-page',
  templateUrl: 'location-inventory.html',
})

/**
 * This class extends the infinite list class to create a list of the possible
 * locations. Besides choosing a location from the list the user can also
 * write or scan a location and the system will check if the location is
 * valid or it is not
 */
export class LocationInventoryPage extends InfiniteList implements AfterViewInit{
  itemInput: string = '';
  lostInput: string = '';
  location_code: string = '';
  @ViewChild('focusInput') myInput;
  item: string;
  elementInput: boolean = false;
  location: Location;
  blur_element: boolean;

  constructor(public navCtrl: NavController, public trytond_provider: TrytonProvider,
      public navParams: NavParams, public events: Events) {
    super(navCtrl, trytond_provider, events)
    this.method = "stock.location";
    this.domain = [new EncodeJSONRead().createDomain("type", "=", "storage")];
    this.fields = ["name", "code"];
    this.loadData();
    this.blur_element = true;
    this.elementInput = false;
  }

  ngAfterViewInit() {
    // console.log("set input");

    //document.getElementById('test').focus()
    Keyboard.close()
  }

  blurInput(event){
    if (this.blur_element){
      document.getElementById('test').focus()
      //Keyboard.close()
    }
    this.blur_element = false;
  }

  ionViewDidEnter() {
   this.blur_element = true;
   Keyboard.close()
  }

  setFocus(event) {
   console.log("Focus set");
  }

 /**
 * Clears the input
 */
  public clearInput(): void{
    this.itemInput = '';
    this.location_code = '';
  }

  /**
   * Gets called when a location from the list is selected
   * @param {Object} event   Event description
   * @param {Location} item  Location selected
   * @returns                Go to the next page
   */
  itemSelected(event, item) {
    this.navCtrl.push(new Routing().getNext(this.constructor.name), { params: {
      location: item,
      new_inventory: true}} )
  }

  /**
   * Go to the next stage, check if the entered location is valid
   */
  goForward() {
    // console.log("Searching for code", this.itemInput, this.lostInput);
    let json_constructor = new EncodeJSONRead();
    let search_domain = [json_constructor.createDomain("name", "in", [this.itemInput, this.lostInput])];
    let fields = ['name', 'code', 'type'];
    let method = "stock.location";
    json_constructor.addNode(method, search_domain, fields);
    let json = json_constructor.createJson();

    this.trytond_provider.search(json).subscribe(
      data => {
        let storage = undefined;
        let lost_found = undefined;
        if (data[method].length === 2) {
          for (let location of data[method]) {
            if (location['type'] == 'storage') {
              storage = location;
            }
            if (location['type'] == 'lost_found') {
              lost_found = location;
            }
          }
          if ((lost_found != undefined) && (storage != undefined)) {
              this.itemInput = '';
              this.lostInput = '';
              this.location_code = '';
              this.navCtrl.push(new Routing().getNext(this.constructor.name), { params: {
                  location: storage,
                  lost_found: lost_found,
                  new_inventory: true}} )
          } else {
            alert("Incorrect Location");
            this.itemInput = '';
            this.lostInput = '';
            this.location_code = '';
          }
        } else{
          alert("Incorrect Location");
          this.itemInput = '';
          this.lostInput = '';
          this.location_code = '';
        }
      },
      error => {
        console.log("Error", error)
      })
  }

  /**
   * Listener for an input event. Sets the done button enabled or disabled
   * @param {Object} event Event description
   */
  inputChange(event) {
    if (this.itemInput){
      this.elementInput = true;
      this.goForward();
    }
    else
      this.elementInput = false;
  }

  ngOnDestroy() {
    console.log("Destroying element")
  }
}
