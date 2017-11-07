import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MenuPage } from '../../ngx-menu/menu'
import { InventoriesPage } from '../inventories/inventories'
import { Routing } from '../../../pages/routing/routing';


@Component({
  selector: 'page-inventory',
  templateUrl: '../../ngx-menu/menu.html'
})
/**
 * This class creates the main menu for the inventories.
 * The user can choose between creating a new inventory or looking at one
 * already created
 */
export class InventoryPage extends MenuPage {

  constructor(navCtrl: NavController) {
    super(navCtrl)
    this.title = 'Inventarios'
    /**
     * New menus go here,
     * params = true means we are creating a new inventory.
     * @type {Array}
     */
    this.menu = [
      { name: "Inventories", page: new Routing().getNext('INVENTORY_LOCATION_MENU'), params: true },
      { name: "Inventory List", page: InventoriesPage, params: false }
    ]
  }
}
