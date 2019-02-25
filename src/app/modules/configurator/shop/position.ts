import {Product} from './product';

export class Position {
  name: string;
  products: Product[] = [];
  price: number;
  taxProducts: number;
  visible = false;

  constructor(product?: Product) {
    if (product) {
      this.name = product.positionName;
      this.products.push(product);
    }
  }

  loadDataFromJson(jsonData) {
    Object.assign(this, jsonData);
    this.products = [];
    let newProduct;
    for (let i = 0; i < jsonData.products.length; i++) {
      newProduct = new Product();
      newProduct.loadDataFromJson(jsonData.products[i]);
      this.products.push(newProduct);
    }
  }
}
