import {IProduct, IProductResponse} from "../../types";
import {appApi} from "../API/appAPI.ts";
import {Product} from "../Models/product.ts";
import {ModalView} from "../view/ModalView.ts";
import {GalleryView} from "../view/GalleryView.ts";
import {EventEmitter} from "../base/Events.ts";
import {cloneTemplate} from "../../utils/utils.ts";
import {CardCatalog} from "../view/Card/CardCatalog/CardCatalog.ts";
import {CardPreview} from "../view/Card/CardPreview/CardPreview.ts";
import {HeaderView} from "../view/HeaderView.ts";
import {CardCart} from "../view/Card/CardCart/CardCart.ts";
import {Cart} from "../Models/cart.ts";


export interface ICartPresenter {
    init(): Promise<void>;
    loadProducts(): Promise<void>;
    renderProducts(products: IProduct[]): void;
}

export class PresenterCart implements ICartPresenter {

    private index: number = 0;
    private cartModal: Cart;
    private headerView: HeaderView;
    private modalView: ModalView;
    private cardTemplate: HTMLTemplateElement;
    private modal: HTMLElement;
    private event: EventEmitter;

    constructor(headerView: HeaderView, cartModal: Cart, cardTemplate: HTMLTemplateElement, event: EventEmitter, modal: HTMLElement) {

        this.cartModal = cartModal;
        this.headerView = headerView;
        this.cardTemplate = cardTemplate;
        this.modal = modal;
        this.event = event
        this.modalView = new ModalView(this.modal, this.event)

    }


    addInList(product: IProduct): void {

    }

    private createCard(product: IProduct): HTMLElement {


        const cardElement = cloneTemplate<HTMLElement>(this.cardTemplate)
        const cardCart = new CardCart(cardElement);

        cardCart.setContent({
            title: product.title,
            price: product.price,
            id: product.id,
            index: this.index,
        });

        return cardElement;
    }

    onCardClick(id: string): void {
        const product = this.productModel.getProductById(id);
        const cardTemplateElement = document.getElementById('card-preview') as HTMLTemplateElement;
        const cardElement = cloneTemplate<HTMLElement>(cardTemplateElement)
        const card = new CardPreview(cardElement, this.event);
        if (product) {
            card.setContent({
                title: product.title,
                price: product.price,
                id: product.id,
                category: product.category,
                image: product.image,
                description: product.description,
            })
            this.modalView.setContent(cardElement)
            this.modal.classList.add('modal_active');
        } }

}