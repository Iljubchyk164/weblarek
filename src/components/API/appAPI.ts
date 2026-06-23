import {IApi, IOrder, IOrdersResponse, IProductResponse} from "../../types";

export class appApi {

    api: IApi;

    constructor (api: IApi) {
        this.api = api;
    }

    getProduct(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>('/product/');
    }

    postOrder(order: IOrder): Promise<IOrdersResponse> {
        return this.api.post<IOrdersResponse>('/order/', order, 'POST');
    }
}