import './scss/styles.scss';
import {AppApi} from "./components/API/AppApi.ts";
import {API_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
import {GalleryView} from "./components/view/GalleryView.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {Presenter} from "./components/Presenters/Presenter.ts";
import {ModalView} from "./components/view/ModalView.ts";
import {Product} from "./components/Models/product.ts";
import {Cart} from "./components/Models/cart.ts";
import {Customer} from "./components/Models/customer.ts";
import {HeaderView} from "./components/view/HeaderView.ts";
import {SuccessView} from "./components/view/SuccessView.ts";
import {CartView} from "./components/view/CartView.ts";
import {FormContacts} from "./components/view/Form/FormContacts/FormContacts.ts";
import {FormOrder} from "./components/view/Form/FormOrder/FormOrder.ts";
import {CardPreview} from "./components/view/Card/CardPreview/CardPreview.ts";



const baseApi = new Api(API_URL)
const api = new AppApi(baseApi)

const event = new EventEmitter()

const productModel = new Product(event);
const cartModel = new Cart(event)
const customerModel = new Customer(event);

const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    success: ensureElement<HTMLTemplateElement>('#success'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardCart: ensureElement<HTMLTemplateElement>('#card-basket'),
    cart: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
}


const containers = {
    header: ensureElement<HTMLElement>('.header'),
    gallery: ensureElement<HTMLElement>('.gallery'),
    modal: ensureElement<HTMLElement>('.modal'),
}


const views = {
    gallery: new GalleryView(containers.gallery),
    modal: new ModalView(containers.modal, event),
    header: new HeaderView(containers.header, event),
    success: new SuccessView(cloneTemplate<HTMLElement>(templates.success), event),
    cart: new CartView(cloneTemplate<HTMLElement>(templates.cart), event),
    cardPreview: new CardPreview(cloneTemplate<HTMLElement>(templates.cardPreview), event),
    formContacts: new FormContacts(cloneTemplate<HTMLElement>(templates.contacts), event),
    formOrder: new FormOrder(cloneTemplate<HTMLElement>(templates.order), event),
}

const models = {
    product: productModel,
    cart: cartModel,
    customer: customerModel,
}




const presenterGallery = new Presenter(
    {api,
    event,
    models,
    views,
    templates,
    containers,}
)

presenterGallery.init()
