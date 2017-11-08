import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import { InfiniteList } from '../../ngx-tryton-infinite-list/infinite-list'
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
  location_code: string = '';
  @ViewChild('focusInput') myInput;
  item: string;
  elementInput: boolean = false;
  location: Location;
  blur_element: boolean;

  constructor(public navCtrl: NavController, public trytond_provider: TrytonProvider,
      public navParams: NavParams, public events: Events) {
    super(navCtrl, trytond_provider, events)

    console.log("data", navParams.get('params'))
    this.method = "stock.location";

    this.domain = [new EncodeJSONRead().createDomain("type",
      "=", "storage")];
    this.fields = ["name", "code"]
    this.loadData();
    this.blur_element = true;
    this.elementInput = false;
  }

  ngAfterViewInit() {
    console.log("set input")

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
     console.log("Inside view");
     this.blur_element = true;
     //document.getElementById('test').focus();
     Keyboard.close()
   }
   setFocus(event) {
     console.log("Focus set")
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
    console.log("Item selected", item, "Going to next page", this.navParams.get('param'))
    this.navCtrl.push(new Routing().getNext(this.constructor.name), { params: {
      location: item,
      new_inventory: true}} )
  }

  /**
   * Go to the next stage, check if the entered location is valid
   */
  goForward() {
    console.log("Searching for code", this.itemInput);
    let json_constructor = new EncodeJSONRead();
    let search_domain = [json_constructor.createDomain(
      "rec_name", "=", this.itemInput)]
    let fields = ['name', 'code']
    let method = "stock.location"
    json_constructor.addNode(method, search_domain, fields)
    let json = json_constructor.createJson()

    this.trytond_provider.search(json).subscribe(
      data => {
        console.log("Location exists", data[method], data[method].length, data[method] > 0);
        if (data[method].length > 0) {
          this.location = data[method];
          // Clear input field
          this.itemInput = '';
          this.location_code = '';

          this.navCtrl.push(new Routing().getNext(this.constructor.name), { params: {
              location: this.location[0],
              new_inventory: true}} )
        }
        else{
          alert("Incorrect Location");
          this.itemInput = '';
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
    console.log("INput changed")
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
