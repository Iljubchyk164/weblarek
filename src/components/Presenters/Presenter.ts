import {IProduct, IProductResponse, TPayment} from "../../types";
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
        cardPreview: CardPreview;
        /*cardCatalog: CardCatalog;
        cardCart: CardCart;*/
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
        /*this.config.views.formOrder = null;
        this.config.views.formContacts = null;*/
    }


    async init(): Promise<void> {
        try {
            this.setupEventListeners()
            await this.loadProducts();
        } catch (error) {
            console.error(error);
        }
    }


    private async loadProducts(): Promise<void> {
        try {
            const data: IProductResponse = await this.config.api.getProduct();
            this.config.models.product.setProducts(data.items);
        } catch (error) {
            console.error(error);
        }
    }


    private setupEventListeners(): void {

        //models

        this.config.event.on('cart:updated', () => {
            this.cartUpdate();
        });

        this.config.event.on('customer:updated', () => {
            this.customerUpdate();
        });

        this.config.event.on('product:updated', () => {
            this.renderProducts();
        });

        this.config.event.on('product:currentProductSelected', () => {
            this.currentProductSelected();
        });

        //views

        this.config.event.on('form:openNextForm', () => {
            this.secondOrderModal();
        });

        this.config.event.on('payment:selected', (data: {method: TPayment}) => {
            this.paymentSelected(data.method);
        });

        this.config.event.on('address:written', (data: {address: string}) => {
            this.addressWrite(data.address);
        });

        this.config.event.on('email:written', (data: {email: string}) => {
            this.emailWrite(data.email);
        });

        this.config.event.on('phone:written', (data: {phone: string}) => {
            this.phoneWrite(data.phone);
        });

        this.config.event.on('cart:openForm', () => {
            this.firstOrderModal();
        });

        this.config.event.on('card:deleted', (data: { id: string }) => {
            this.deleteFromCart(data.id);
        });

        this.config.event.on('header:openCart', () => {
            this.cartOpen();
        });


        this.config.event.on('modal:close', () => {
            this.modalClose();
        });

        this.config.event.on('card:selected', (data: { id: string }) => {
            this.onCardClick(data.id);
        });

        this.config.event.on('card:action', () => {
            this.changeCart();
        });

        this.config.event.on('form:submit', () => {
            this.submit();
        });

    }

    private getButtonText(product: IProduct, inCart: boolean) {
        if (inCart) {
            return 'Удалить из корзины';
        } else if (product.price === null) {
            return 'Недоступно'
        } else {
            return 'В корзину'
        }
    }

    //models

    private renderProducts(): void {
        const products = this.config.models.product.getProductsArray();
        if (products.length === 0) {
            return;
        }
        this.config.views.gallery.catalog = products.map(product => this.createCard(product));
    }

    private currentProductSelected() {
        const product = this.config.models.product.getCurrentProduct();
        if (product) {
            const card = this.config.views.cardPreview;
            card.content = {
                title: product.title,
                price: product.price,
                id: product.id,
                category: product.category,
                image: product.image,
                description: product.description,
            }
            const inCart = this.config.models.cart.productInCart(product.id)
            this.config.views.modal.render({content: card.render({ buttonDisabled: product.price === null, buttonText: this.getButtonText(product, inCart)})})
            this.config.views.modal.openModal();
        }
    }

    private cartUpdate() {
        function isDefined<T>(value: T | undefined): value is T {
            return value !== undefined;
        }
        const cart = this.config.models.cart;
        const cartView = this.config.views.cart;
        const products = cart.getCartProductsArray().map((product, index) => {
            const card = new CardCart(cloneTemplate<HTMLElement>(this.config.templates.cardCart), () => this.config.event.emit('card:deleted', {id: product.id}));
            if (product) {
                card.content = {
                    title: product.title,
                    price: product.price,
                    id: product.id,
                    index: index + 1,
                }
                return card.render()
            }
        })
        if (products.length === 0) {
            this.config.views.modal.render({content: cartView.render({list: products as HTMLElement[], price: cart.getCartPrices(), buttonDisabled: products.length === 0})})
        }
        if (products.every(isDefined) && products.length > 0) {
            this.config.views.modal.render({content: cartView.render({list: products, price: cart.getCartPrices(), buttonDisabled: products.length === 0})})
        }
        this.updateHeader()
    }

    private customerUpdate() {
        const formOrder = this.config.views.formOrder
        const formContacts = this.config.views.formContacts
        const customer = this.config.models.customer

        const errors = customer.validate()
        const orderErrors = {
            payment: errors.payment,
            address: errors.address,
        }
        const contactsErrors = {
            email: errors.email,
            phone: errors.phone,
        }

        const filterOrderErrors = Object.fromEntries(
            Object.entries(orderErrors).filter(([_, value]) => value && value.trim() !== '')
        )
        const filterContactsErrors = Object.fromEntries(
            Object.entries(contactsErrors).filter(([_, value]) => value && value.trim() !== '')
        )
        formOrder.updateModal(
            {
                isValid: Object.keys(filterOrderErrors).length === 0,
                errors: filterOrderErrors,
            }
        )

        formContacts.updateModal(
            {
                isValid: Object.keys(filterContactsErrors).length === 0,
                errors: filterContactsErrors,
            }
        )
        formOrder.render({payment: customer.getCustomer().payment, address: customer.getCustomer().address})
        formContacts.render({email: customer.getCustomer().email, phone: customer.getCustomer().phone})
    }

    //views

    private createCard(product: IProduct): HTMLElement {
        const cardElement = cloneTemplate<HTMLElement>(this.config.templates.cardCatalog)
        const card = new CardCatalog(cardElement, () => this.config.event.emit('card:selected', {id: product.id}));
        card.content = {
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
            id: product.id
        };
        return card.render()
    }

    private onCardClick(id: string): void {
        this.config.models.product.setCurrentProduct(this.config.models.product.getProductById(id));
    }

    private changeCart(): void {
        const product = this.config.models.product.getCurrentProduct();
        if (product) {
            if (this.config.models.cart.productInCart(product.id)) {
                this.deleteFromCart(product.id);
                this.modalClose();
                return
            }
            this.config.models.cart.pushProductInCart(product);
            this.modalClose()
        }
    }

    private updateHeader(): void {
        this.config.views.header.counter = this.config.models.cart.getCartSize()
    }

    private modalClose(): void {
        this.config.views.modal.closeModal();
    }

    private cartOpen(): void {
        const cartView = this.config.views.cart;
        this.config.views.modal.render({content: cartView.render()})
        this.config.views.modal.openModal();
    }

    private deleteFromCart(id: string) {
        this.config.models.cart.deleteProductFromCart(id)
    }

    private firstOrderModal(): void {
        this.customerUpdate()
        const form = this.config.views.formOrder
        this.config.views.modal.render({content: form.render()})
    }

    private paymentSelected(method: TPayment) {
        this.config.models.customer.setPayment(method);
    }

    private addressWrite(address: string): void {
        this.config.models.customer.setAddress(address);
    }

    private secondOrderModal(): void {
        this.customerUpdate()
        const form = this.config.views.formContacts
        this.config.views.modal.render({content: form.render()})
    }

    private emailWrite(email: string) {
        this.config.models.customer.setEmail(email);
    }

    private phoneWrite(phone: string): void {
        this.config.models.customer.setPhone(phone);
    }

    private async submit(): Promise<void>  {
        const order = {
            ...this.config.models.customer.getCustomer(),
            items: this.config.models.cart.getCartProductsArray().map(item => item.id),
            total: this.config.models.cart.getCartPrices(),
        }
        try {
            const postData = await this.config.api.postOrder(order)
            const success = this.config.views.success
            this.reset()
            this.config.views.modal.render({content: success.render({price: postData.total})})
        } catch (e) {
            console.log(e)
        }
    }

    private reset(): void {
        this.config.models.customer.clearCustomer()
        this.config.models.cart.resetCart()
        this.config.views.formOrder.address = ''
        this.config.views.formOrder.payment = ''
        this.config.views.formContacts.phone = ''
        this.config.views.formContacts.email = ''
    }
}