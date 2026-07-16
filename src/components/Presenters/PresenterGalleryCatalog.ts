import {IProduct, IProductResponse} from "../../types";
import {appApi} from "../API/appAPI.ts";
import {Product} from "../Models/product.ts";
import {GalleryView} from "../view/GalleryView.ts";
import {CardCatalog} from "../view/Card/CardCatalog/CardCatalog.ts";
import {cloneTemplate} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";
import {ModalView} from "../view/ModalView.ts";
import {CardPreview} from "../view/Card/CardPreview/CardPreview.ts";
import {Cart} from "../Models/cart.ts";
import {HeaderView} from "../view/HeaderView.ts";
import {SuccessView} from "../view/SuccessView.ts";
import {CartView} from "../view/CartView.ts";
import {Customer} from "../Models/customer.ts";
import {CardCart} from "../view/Card/CardCart/CardCart.ts";
import {FormContacts} from "../view/Form/FormContacts/FormContacts.ts";
import {FormOrder} from "../view/Form/FormOrder/FormOrder.ts";

export interface IGalleryPresenter {
    init(): Promise<void>;
    loadProducts(): Promise<void>;
    renderProducts(products: IProduct[]): void;
}

export class PresenterGalleryCatalog implements IGalleryPresenter {

    private api: appApi;
    private modalView: ModalView;
    private galleryView: GalleryView;
    private headerView: HeaderView;
    private successView: SuccessView;
    private cartView: CartView;
    private cardCartView: CardCart;
    private cardCatalogView: CardCatalog;
    private cardPreviewView: CardPreview;
    private formContacts: FormContacts;
    private formOrder: FormOrder;
    private cardTemplateCatalog: HTMLTemplateElement;
    private successTemplate: HTMLTemplateElement;
    private cardTemplatePreview: HTMLTemplateElement;
    private cardTemplateCart: HTMLTemplateElement;
    private cartTemplate: HTMLTemplateElement;
    private orderTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    private modal: HTMLElement;
    private header: HTMLElement;
    private gallery: HTMLElement;
    private event: EventEmitter;
    private cartModel: Cart;
    private productModel: Product;
    private customerModel: Customer;

    constructor(
        api: appApi,
        views: {
            galleryView: GalleryView,
            modalView :ModalView,
            headerView :HeaderView,
            successView: SuccessView,
            cartView: CartView,
            cardCartView: CardCart,
            cardCatalogView: CardCatalog,
            cardPreviewView: CardPreview,
            formContactsView: FormContacts,
            formOrderView: FormOrder,
        }
        templates:{
            cardTemplateCatalog: HTMLTemplateElement,
            successTemplate: HTMLTemplateElement,
            cardTemplatePreview: HTMLTemplateElement,
            cardTemplateCart: HTMLTemplateElement,
            cartTemplate: HTMLTemplateElement,
            orderTemplate: HTMLTemplateElement,
            contactsTemplate: HTMLTemplateElement,
        }
        event: EventEmitter,
        containers: {
            modal: HTMLElement,
            header: HTMLElement,
            gallery: HTMLElement,
    }
        models: {
        cartModel: Cart,
        productModel: Product,
        customerModel: Customer,
    }

    ) {
        this.api = api;
        this.galleryView = galleryView;
        this.modalView = modalView
        this.headerView = headerView;
        this.successView = successView;
        this.cartView = cartView;
        this.cardCartView = cardCartView,
        this.cardCatalogView = cardCatalogView,
        this.cardPreviewView = cardPreviewView,
        this.formContacts = formContactsView,
        this.formOrder = formOrderView,
        this.cardTemplateCatalog = cardTemplateCatalog;
        this.successTemplate = successTemplate;
        this.cardTemplatePreview = cardTemplatePreview;
        this.cardTemplateCart = cardTemplateCart;
        this.cartTemplate = cartTemplate;
        this.orderTemplate = orderTemplate;
        this.contactsTemplate = contactsTemplate;
        this.event = event
        this.modal = modal;
        this.header = header;
        this.gallery = gallery;
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.customerModel = customerModel;



    }


    async init(): Promise<void> {
        try {
            await this.loadProducts();
            this.renderProducts(this.productModel.getProductsArray());
        } catch (error) {
            console.error(error);
        }
    }


    async loadProducts(): Promise<void> {
        try {
            const data: IProductResponse = await this.api.getProduct();
            this.productModel.setProducts(data.items);
        } catch (error) {
            console.error(error);
        }
    }


    renderProducts(products: IProduct[]): void {
        if (products.length === 0) {
            return;
        }

        const cardElements = products.map(product => this.createCard(product));
        this.galleryView.setCatalog(cardElements);
    }

    private createCard(product: IProduct): HTMLElement {
        const cardElement = cloneTemplate<HTMLElement>(this.cardTemplateCatalog)
        const card = new CardCatalog(cardElement, this.event);
        card.setContent({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
            id: product.id
        });

        this.event.on('card:select', (data: { id: string}) => {
            this.onCardClick(data.id);
        });

        return cardElement;
    }

    private onCardClick(id: string): void {
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

        this.event.on('addInList', (data: { id: string}) => {
                this.addInList(data.id);
            });

    } }

    private addInList(id: string): void {
        const product = this.productModel.getProductById(id);
        const cart = this.cartModel;
        cart.pushProductInCart(product);

    }

}