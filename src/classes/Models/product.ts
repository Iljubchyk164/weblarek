import {IProduct} from '../../types/index.ts' ;

export class Product {
  private productsArray: IProduct[] = [];
  private currentProduct: IProduct | null = null;

  setProducts(products: IProduct[]) {
    if (!Array.isArray(products)) {
      throw new Error('Не массив');
    }
    this.productsArray = products;
  }

  setCurrentProduct(currentProduct: IProduct) {
    this.currentProduct = currentProduct
  }

  getProductsArray(): IProduct[] {
    return this.productsArray;
  }

  getCurrentProduct(): IProduct | null{
    return this.currentProduct
  }

  getProductById(id: string): IProduct {
    const result = this.productsArray.find((element: IProduct) => {
      return element.id === id
    });
    if (!result) {
      throw new Error('Товар не найден')
    }
    return result
  } 

  
}