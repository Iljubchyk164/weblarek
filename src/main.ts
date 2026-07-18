import './scss/styles.scss';
import {appApi} from "./components/API/appAPI.ts";
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
import {CardCart} from "./components/view/Card/CardCart/CardCart.ts";
import {CardCatalog} from "./components/view/Card/CardCatalog/CardCatalog.ts";
import {CardPreview} from "./components/view/Card/CardPreview/CardPreview.ts";
import {FormContacts} from "./components/view/Form/FormContacts/FormContacts.ts";
import {FormOrder} from "./components/view/Form/FormOrder/FormOrder.ts";



const baseApi = new Api(API_URL)
const api = new appApi(baseApi)

const event = new EventEmitter()

const productModel = new Product();
const cartModel = new Cart()
const customerModel = new Customer();

const templates = {
    cardCatalog: document.getElementById('card-catalog') as HTMLTemplateElement,
    success: document.getElementById('success') as HTMLTemplateElement,
    cardPreview: document.getElementById('card-preview') as HTMLTemplateElement,
    cardCart: document.getElementById('card-basket') as HTMLTemplateElement,
    cart: document.getElementById('basket') as HTMLTemplateElement,
    order: document.getElementById('order') as HTMLTemplateElement,
    contacts: document.getElementById('contacts') as HTMLTemplateElement,
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
    cardCart: new CardCart(cloneTemplate<HTMLElement>(templates.cardCart), event),
    cardCatalog: new CardCatalog(cloneTemplate<HTMLElement>(templates.cardCatalog), event),
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
