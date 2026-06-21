import {IApi, IOrder, IOrdersResponse, IProductResponse} from "../../types";

export class appApi {

    api: IApi;

    constructor (api: IApi) {
        this.api = api;
    }

    get(): Promise<IProductResponse> {
        return this.api.get('/product/');
    }

    post(order: IOrder): Promise<IOrdersResponse> {
        return this.api.post('/order/', order, 'POST');
    }
}