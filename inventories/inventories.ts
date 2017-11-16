import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { Locker } from 'angular-safeguard';
import {TranslateService} from 'ng2-translate';


import { InfiniteList } from '../../ngx-tryton-infinite-list/infinite-list'
import { EncodeJSONRead } from '../../ngx-tryton-json/encode-json-read'
import { TrytonProvider } from '../../ngx-tryton-providers/tryton-provider'
import { Inventory } from '../../ngx-tryton-stock-interface/inventory'
import { Location } from '../../ngx-tryton-stock-interface/location'

import { Routing } from '../../../pages/routing/routing';

@Component({
  selector: 'page-inventories',
  templateUrl: 'inventories.html'
})

/**
 * This component controlls the list of already created inventories
 */
export class InventoriesPage extends InfiniteList{
  inventory: Inventory;
  location: Location;
  title: string;
  local_storage = this.locker.useDriver(Locker.DRIVERS.LOCAL)
  loading: any;

  constructor(public navCtrl: NavController,
      public trytond_provider: TrytonProvider,
      private navParams: NavParams, public locker: Locker,
      public events: Events, private loadingCtrl: LoadingController,
      private translateService: TranslateService) {
    super(navCtrl, trytond_provider, events)
    this.title = "InventoriesMenu";
    this.method = "stock.inventory";

    // TODO: might need to change and look for location
    this.domain = [new EncodeJSONRead().createDomain("state",
        "=", "draft")];
    this.fields = ["date", "company", "location.name", "location.code",
    "location.parent.name", "location", "state"];
    this.showLoading()
    this.loadData()
  }

  /**
    * Gets called when a inventory from the list is selected
    * @param {Object} event   Event description
    * @param {Location} item  Location selected
    * @returns                Go to the next page
    */
  itemSelected(event, item){

    this.location = {
      name: item['location.name'],
      code: item['location.code'],
      'parent.name': item['locationparent_name'],
      id: item.location
    }
    this.inventory = {
      company: item.company_id,
      date: item.date,
      state: item.state,
      location: this.location,
      lost_found: 7, // TODO: hardcode lost found ID location
      id: item.id
    }
    this.navCtrl.push(new Routing().getNext(this.constructor.name), {params:
      {
        location: this.location,
        params: false,
        inventory: this.inventory,
        new_inventory: false
      }
    })
  }

  /**
   * Shows a loading component on top of the view
   */
  private showLoading() {
    let loading_text;
    this.translateService.get('Loading').subscribe(
      value => {
        loading_text = value
      }
    );
    this.loading = this.loadingCtrl.create({
      content: loading_text
    });
    this.loading.present();
    this.hideLoading();
  }

  /**
   * Hides the current loading component on the screen
   */
  private hideLoading() {
    this.events.subscribe("Data loading finished", (eventData) => {
      this.loading.dismiss();
    })
  }
}
