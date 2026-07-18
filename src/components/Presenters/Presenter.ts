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
        cardCatalog: CardCatalog;
        cardPreview: CardPreview;
        cardCart: CardCart;
        formContacts: FormContacts | null;
        formOrder: FormOrder | null;
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
        this.config.views.formOrder = null;
        this.config.views.formContacts = null;
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

        this.config.event.on('nextOrderModal', () => {
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

        this.config.event.on('order', () => {
            this.firstOrderModal();
        });

        this.config.event.on('deleteFromCart', (data: { id: string }) => {
            this.deleteFromCart(data.id);
        });

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

        this.config.event.on('submit', () => {
            this.submit();
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
            card.haveInCart(this.config.models.cart.productInCart(id))
            if (product.price === undefined || product.price === null) {
                card.disabledButton(true)
            }
            this.config.views.modal.openModal();

        } }

    private addInCart(id: string): void {
        if (this.config.models.cart.productInCart(id)) {
            this.deleteFromCart(id);
            this.modalClose();
            return
        }
        const product = this.config.models.product.getProductById(id);
        const cart = this.config.models.cart;
        cart.pushProductInCart(product);
        this.updateHeader()
        this.modalClose()
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
        })

    }

    private deleteFromCart(id: string) {
        this.config.models.cart.deleteProductFromCart(id)
        this.cartOpen()
        this.updateHeader()
    }

    private firstOrderModal(): void {
        if (!this.config.views.formOrder) {
            const orderElement = cloneTemplate<HTMLElement>(this.config.templates.order)
            this.config.views.formOrder = new FormOrder(orderElement, this.config.event);
            this.config.views.modal.setContent(orderElement)
        } else {
            this.config.views.modal.setContent(this.config.views.formOrder.render())
        }

        const customer = this.config.models.customer

        if(customer.getCustomer().payment) {
            this.config.views.formOrder.setPayment(customer.getCustomer().payment)
        }

        if(customer.getCustomer().address) {
            this.config.views.formOrder.setAddress(customer.getCustomer().address)
        }

        const errors = customer.validateOrder()
        const filterErrors = Object.fromEntries(
            Object.entries(errors).filter(([_, value]) => value && value.trim() !== '')
        )
        this.config.views.formOrder.updateModal(
            {
                isValid: Object.keys(errors).length === 0,
                errors: filterErrors,
            }
        )

    }

    private paymentSelected(method: TPayment) {
        this.config.models.customer.setPayment(method);
        this.firstOrderModal();
    }

    private addressWrite(address: string): void {
        this.config.models.customer.setAddress(address);
        this.firstOrderModal();
    }

    private secondOrderModal(): void {
        if (!this.config.views.formContacts) {
            const contactsElement = cloneTemplate<HTMLElement>(this.config.templates.contacts)
            this.config.views.formContacts = new FormContacts(contactsElement, this.config.event);
            this.config.views.modal.setContent(contactsElement)
        } else {
            this.config.views.modal.setContent(this.config.views.formContacts.render())
        }


        const customer = this.config.models.customer

        if(customer.getCustomer().email) {
            this.config.views.formContacts.setEmail(customer.getCustomer().email)
        }

        if(customer.getCustomer().phone) {
            this.config.views.formContacts.setPhone(customer.getCustomer().phone)
        }

        const errors = customer.validateContacts()
        const filterErrors = Object.fromEntries(
            Object.entries(errors).filter(([_, value]) => value && value.trim() !== '')
        )
        this.config.views.formContacts.updateModal(
            {
                isValid: Object.keys(errors).length === 0,
                errors: filterErrors,
            }
        )

    }

    private emailWrite(email: string) {
        this.config.models.customer.setEmail(email);
        this.secondOrderModal()
    }

    private phoneWrite(phone: string): void {
        this.config.models.customer.setPhone(phone);
        this.secondOrderModal()
    }

    private async submit(): Promise<void>  {
        const order = {
            ...this.config.models.customer.getCustomer(),
            items: this.config.models.cart.getCartProductsArray().map(item => item.id),
            total: this.config.models.cart.getCartPrices(),
        }
        try {
            const postData = await this.config.api.postOrder(order)
            const successElement = cloneTemplate<HTMLElement>(this.config.templates.success)
            const success = new SuccessView(successElement, this.config.event);
            success.setContent(postData.total)
            this.config.views.modal.setContent(successElement)
            this.reset()
        } catch (e) {
            console.log(e)
        }
    }

    private reset(): void {
        this.config.models.customer.clearCustomer()
        this.config.models.cart.resetCart()
        this.config.views.formOrder?.setAddress('')
        this.config.views.formOrder?.setPayment('')
        this.config.views.formContacts?.setPhone('')
        this.config.views.formContacts?.setEmail('')
        this.updateHeader()
    }
}