import {IProduct} from '../../types' ;
import {EventEmitter} from "../base/Events.ts";

export class Product {
  private productsArray: IProduct[] = [];
  private currentProduct: IProduct | null = null;

  constructor(private event: EventEmitter) {}

  setProducts(products: IProduct[]) {
    this.productsArray = products;
    this.event.emit('product:updated');
  }

  setCurrentProduct(currentProduct: IProduct | null) {
    this.currentProduct = currentProduct
    this.event.emit('product:currentProductSelected');
  }

  getProductsArray(): IProduct[] {
    return this.productsArray;
  }

  getCurrentProduct(): IProduct | null{
    return this.currentProduct
  }

  getProductById(id: string): IProduct | null {
    const result = this.productsArray.find((element: IProduct) => {
      return element.id === id
    });
    if (!result) {
      return null
    }
    return result
  } 

  
}