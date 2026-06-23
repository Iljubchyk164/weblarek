import {IProduct} from '../../types' ;

export class Product {
  private productsArray: IProduct[] = [];
  private currentProduct: IProduct | null = null;

  setProducts(products: IProduct[]) {
    this.productsArray = products;
  }

  setCurrentProduct(currentProduct: IProduct | null) {
    this.currentProduct = currentProduct
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
      console.log('Товар не найден')
      return null
    }
    return result
  } 

  
}