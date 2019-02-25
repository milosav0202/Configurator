import {Position} from './position';
import { Product } from './product';
import {Artikel} from './item';

import {DataCacheEvents} from '../../../data-cache/data-cache-events';

export class Order  {
  orderNumber: string;
  positions: Position[] = [];
  orderType = 'offer';
  fastline = false;
  comment = '';
  commission = '';
  price: number;
  priceRecycling: number;
  priceWithoutRecycling: number;
  taxProduct: Artikel;
  editProduct: Product;
  deliverAddress = new DeliverAddress();
  dataCacheEvents: DataCacheEvents;
  constructor(taxProduct: Artikel) {
    this.taxProduct = taxProduct;
  }

  addProduct(product: Product) {
    const positionExist = this.positions.findIndex((pos: Position) => pos.name === product.positionName);
    if (positionExist >= 0) {
       this.positions[positionExist].products.push(product);
    } else {
      if (product.positionName === '') {
        const numberOfPositions = this.positions.filter((pos: Position) => pos.name);
        product.positionName = 'Position ' + (numberOfPositions.length + 1);
      }
      this.positions.push(new Position(product));
    }

    this.updatePrice();
    this.saveToLocalStorage();
  }

  getBusketCount() {
    let count = 0;
    for (let i = 0; i < this.positions.length; i++) {
      count += this.positions[i].products.length;
    }
    return count;
  }

  removeProduct(product: Product) {
    let positionDelete = false;
    for (let i = 0; i < this.positions.length; i++) {
        for (let j = 0; j < this.positions[i].products.length; j++) {
            // remove item
            if (this.positions[i].products[j] === product) {
                this.positions[i].products.splice(j, 1);
            }
        }
        // remove position if no item exist
        if (this.positions[i].products.length === 0) {
            this.positions.splice(i, 1);
            positionDelete = true;
        }
    }
    this.updatePrice();
    this.saveToLocalStorage();
    return positionDelete;
  }

  removeAllPositions(){
    this.positions = [];
    this.saveToLocalStorage();
  }

  updateProduct(product: Product) {
    this.removeProduct(this.editProduct);
    this.addProduct(product);
  }

  getProductFromInfo(info: ProductInfo) {
    return this.positions[info.positionId].products[info.productId];
  }

  getProductInfo(product: Product) {
    for (let i = 0; i < this.positions.length; i++) {
        for (let j = 0; j < this.positions[i].products.length; j++) {
            if (this.positions[i].products[j] === product) {
                return {positionId: i, productId: j};
            }
        }
    }
  }

  updatePrice() {
    this.price = 0;
    this.priceWithoutRecycling = 0;
    this.priceRecycling = 0;
    this.taxProduct.Count = 0;
    for (const position of this.positions) {
      position.price = 0;
      position.taxProducts = 0;
      for (const product of position.products) {
        product.price = 0;
        product.taxProducts = 0;
        for (const item of product.items) {
          const price = product.price + item.artikel.Verkauf1 * parseFloat(String(item.count));
          product.price = parseFloat(price.toFixed(2));
          if (item.artikel.Z_vRG_pflichtig) {
            product.taxProducts += item.count;
          }
        }
        const positionPrice = position.price + product.price;
        position.price = parseFloat(positionPrice.toFixed(2));
        position.taxProducts += product.taxProducts;
        this.taxProduct.Count += product.taxProducts;
      }
      const orderPrice = this.price + position.price;
      this.priceWithoutRecycling = parseFloat(orderPrice.toFixed(2));
      const priceRec = this.priceRecycling + position.taxProducts * this.taxProduct.Verkauf1;
      this.priceRecycling =   parseFloat((this.priceRecycling + priceRec).toFixed(2));
      this.price =  parseFloat((this.price + this.priceRecycling + this.priceWithoutRecycling).toFixed(2));
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('order', JSON.stringify(this));
  }

  loadFromLocalStorage() {
    const localOrder = JSON.parse(localStorage.getItem('order'));
    if (localOrder !== null) {
      this.loadDataFromJson(localOrder);
    }
  }

  loadDataFromJson(jsonData) {
    Object.assign(this, jsonData);
    this.positions = [];
    let newPosition;
    for (let i = 0; i < jsonData.positions.length; i++) {
      newPosition = new Position();
      newPosition.loadDataFromJson(jsonData.positions[i]);
      this.positions.push(newPosition);
    }
  }
}

export class DeliverAddress {
  name = '';
  zhd = '';
  street = '';
  postcode = '';
  city = '';
}

export class ProductInfo {
  positionId: number;
  productId: number;
}
