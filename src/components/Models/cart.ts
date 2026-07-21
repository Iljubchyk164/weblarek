import {IProduct} from '../../types' ;
import {EventEmitter} from "../base/Events.ts";

export class Cart {
  private cartProductsArray = new Map<string, IProduct>();

  constructor(private event: EventEmitter) {}

  getCartProductsArray(): IProduct[] {
    return Array.from(this.cartProductsArray.values())
  }

  pushProductInCart(product: IProduct | null) {
    if (product) {
      this.cartProductsArray.set(product.id, product)
    }
    this.event.emit('cart:updated')
  }

  deleteProductFromCart(id: string) {
    this.cartProductsArray.delete(id)
    this.event.emit('cart:updated')
  }

  resetCart() {
    this.cartProductsArray.clear();
    this.event.emit('cart:updated')
  }

  getCartPrices(): number {
    return Array.from(this.cartProductsArray.values()).reduce((sum: number, elem: IProduct) => {
        return sum + (elem.price || 0)
    }, 0)
  }

  getCartSize(): number{
    return this.cartProductsArray.size
  }

  productInCart(id: string): boolean{
    return this.cartProductsArray.has(id)
  }
}