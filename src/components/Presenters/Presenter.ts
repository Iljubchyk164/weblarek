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

interface IPresenterConfig {
    api: appApi;
    event: EventEmitter;
    models: {
        product: Product;
        cart: Cart;
        customer: Customer;
    };
    views: {
        gallery: GalleryView;
        modal: ModalView;
        header: HeaderView;
        success: SuccessView;
        cart: CartView;
        cardCatalog: CardCatalog;
        cardPreview: CardPreview;
        cardCart: CardCart;
        formContacts: FormContacts;
        formOrder: FormOrder;
    };
    templates: {
        cardCatalog: HTMLTemplateElement;
        cardPreview: HTMLTemplateElement;
        cardCart: HTMLTemplateElement;
        cart: HTMLTemplateElement;
        order: HTMLTemplateElement;
        contacts: HTMLTemplateElement;
        success: HTMLTemplateElement;
    };
    containers: {
        header: HTMLElement;
        gallery: HTMLElement;
        modal: HTMLElement;
    };
}

export class Presenter {

    private config: IPresenterConfig;

    constructor(config: IPresenterConfig)
    {
        this.config = config
    }


    async init(): Promise<void> {
        try {
            await this.loadProducts();
            this.renderProducts(this.config.models.product.getProductsArray());
            this.setupEventListeners()
        } catch (error) {
            console.error(error);
        }
    }


    async loadProducts(): Promise<void> {
        try {
            const data: IProductResponse = await this.config.api.getProduct();
            this.config.models.product.setProducts(data.items);
        } catch (error) {
            console.error(error);
        }
    }


    renderProducts(products: IProduct[]): void {
        if (products.length === 0) {
            return;
        }

        const cardElements = products.map(product => this.createCard(product));
        this.config.views.gallery.setCatalog(cardElements);
    }


    private setupEventListeners(): void {

        /*this.config.event.on('order', (data: { id: string }) => {
            this.onCardSelect(data.id);
        });*/


        this.config.event.on('cart:open', () => {
            this.cartOpen();
        });


        this.config.event.on('modal:close', () => {
            this.modalClose();
        });

        this.config.event.on('card:select', (data: { id: string }) => {
            this.onCardClick(data.id);
        });

        this.config.event.on('addInCart', (data: { id: string }) => {
            this.addInCart(data.id);
        });
    }


    private createCard(product: IProduct): HTMLElement {
        const cardElement = cloneTemplate<HTMLElement>(this.config.templates.cardCatalog)
        const card = new CardCatalog(cardElement, this.config.event);
        card.setContent({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
            id: product.id
        });

        return cardElement;
    }

    private onCardClick(id: string): void {
        const product = this.config.models.product.getProductById(id);
        const cardElement = cloneTemplate<HTMLElement>(this.config.templates.cardPreview)
        const card = new CardPreview(cardElement, this.config.event);
        if (product) {
            card.setContent({
                title: product.title,
                price: product.price,
                id: product.id,
                category: product.category,
                image: product.image,
                description: product.description,
            })
        this.config.views.modal.setContent(cardElement)
        this.config.views.modal.openModal();
            console.log("gallery card")

    } }

    private addInCart(id: string): void {
        const product = this.config.models.product.getProductById(id);
        const cart = this.config.models.cart;
        cart.pushProductInCart(product);
        this.updateHeader()
        console.log("add in cart")
    }

    private updateHeader(): void {
        this.config.views.header.setCounter(this.config.models.cart.getCartSize())
    }

    private modalClose(): void {
        this.config.views.modal.closeModal();
    }

    private cartOpen(): void {
        const cart = this.config.models.cart;
        const cartElement = cloneTemplate<HTMLElement>(this.config.templates.cart)
        const cartView = new CartView(cartElement, this.config.event);
        if (cart.getCartProductsArray().length === 0) {
            cartView.disabledButton(true)
            this.config.views.modal.setContent(cartElement)
            this.config.views.modal.openModal();
            return;
        }
        cart.getCartProductsArray().forEach((product, index) => {
            const cardElement = cloneTemplate<HTMLElement>(this.config.templates.cardCart)
            const card = new CardCart(cardElement, this.config.event);
            if (product) {
                card.setContent({
                    title: product.title,
                    price: product.price,
                    id: product.id,
                    index: index + 1,
                })
            }
            cartView.setList(cardElement);
            cartView.setPrice(cart.getCartPrices())
            cartView.disabledButton(false)
            this.config.views.modal.setContent(cartElement)
            this.config.views.modal.openModal();
            console.log("cartOpen")
        })

        }
}