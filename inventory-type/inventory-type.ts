import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MenuPage } from '../../ionic-menu/menu'

import { Routing } from '../../../pages/routing/routing';

@Component({
  selector: 'page-inventory-type',
  templateUrl: '../../ionic-menu/menu.html'
})

/**
 * This class creates the main menu for the inventories.
 * The user can choose between creating a new inventory or looking at one
 * already created
 */
export class InventoryTypePage extends MenuPage {
  constructor(navCtrl: NavController, private navParams: NavParams) {
    super(navCtrl)
    this.title = 'Inventory Type'
    /**
     * New menus go here,
     * params = true means we are creating a new inventory.
     * @type {Array}
     */
    let params = navParams.get('params')
    this.menu = [
      {
        name: "Products Inventory",
        page: new Routing().getNext(this.constructor.name),
        params: {
          location: params.location,
          lost_found: params.lost_found,
          new_inventory: true,
          products_inventory: true}
      },
      {
        name: "Complete Inventory",
        page: new Routing().getNext(this.constructor.name),
        params: {
          location: params.location,
          lost_found: params.lost_found,
          new_inventory: true,
          products_inventory: false}
      }
    ]
  }
}
