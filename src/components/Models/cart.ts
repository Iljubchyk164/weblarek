import {IProduct} from '../../types' ;

export class Cart {
  private cartProductsArray = new Map<string, IProduct>();

  getCartProductsArray(): IProduct[] {
    return Array.from(this.cartProductsArray.values())
  }

  pushProductInCart(product: IProduct | null) {
    if (product) {
      this.cartProductsArray.set(product.id, product)
    }
  }

  deleteProductFromCart(id: string) {
    this.cartProductsArray.delete(id)
  }

  resetCart() {
    this.cartProductsArray.clear();
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