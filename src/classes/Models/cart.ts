import {IProduct} from '../../types/index.ts' ;

export class Cart {
  private cartProductsArray = new Map<string, IProduct>();

  getCartProductsArray(): IProduct[] {
    return Array.from(this.cartProductsArray.values())
  }

  pushProductInCart(product: IProduct) {
    this.cartProductsArray.set(product.id, product)
  }

  deleteProductFromCart(id: string) {
    this.cartProductsArray.delete(id)
  }

  resetCart() {
    this.cartProductsArray.clear();
  }

  getCartPrices(): number {
    let sum = 0;
    this.cartProductsArray.forEach((elem: IProduct) => {
      if (elem.price) {
        sum += elem.price
      }
    })
    return sum;
  }

  getCartSize(): number{
    return this.cartProductsArray.size
  }

  productInCart(id: string): boolean{
    if (this.cartProductsArray.has(id)) {
      return true
    }
    return false
  }
}