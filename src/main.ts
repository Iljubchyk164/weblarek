import './scss/styles.scss';
//import {Cart} from './components/Models/cart'
//import {Product} from './components/Models/product'
//import {Customer} from './components/Models/customer'
import {appApi} from "./components/API/appAPI.ts";
import {API_URL} from "./utils/constants.ts";
import {Api} from "./components/base/Api.ts";
//import {IProductResponse} from "./types";
//import {CardCatalog} from "./components/view/Card/CardCatalog/CardCatalog.ts";
import {GalleryView} from "./components/view/GalleryView.ts";
import {ensureElement} from "./utils/utils.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {PresenterGalleryCatalog} from "./components/Presenters/PresenterGalleryCatalog.ts";
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



console.log('_________API____________')
const baseApi = new Api(API_URL)
const api = new appApi(baseApi)

const event = new EventEmitter()

const productModel = new Product();
const cartModel = new Cart()
const customerModel = new Customer();

const templates = {
    cardTemplateCatalog: document.getElementById('card-catalog') as HTMLTemplateElement,
    successTemplate: document.getElementById('success') as HTMLTemplateElement,
    cardTemplatePreview: document.getElementById('card-preview') as HTMLTemplateElement,
    cardTemplateCart: document.getElementById('card-basket') as HTMLTemplateElement,
    cartTemplate: document.getElementById('basket') as HTMLTemplateElement,
    orderTemplate: document.getElementById('order') as HTMLTemplateElement,
    contactsTemplate: document.getElementById('contacts') as HTMLTemplateElement,
}


const containers = {
    header: ensureElement<HTMLElement>('.header'),
    gallery: ensureElement<HTMLElement>('.gallery'),
    modal: ensureElement<HTMLElement>('.modal'),
}


const views = {
    galleryView: new GalleryView(containers.gallery),
    modalView: new ModalView(containers.modal, event),
    headerView: new HeaderView(containers.header, event),
    successView: new SuccessView(templates.successTemplate, event),
    cartView: new CartView(templates.cartTemplate, event),
    cardCartView: new CardCart(templates.cardTemplateCart),
    cardCatalogView: new CardCatalog(templates.cardTemplateCatalog, event),
    cardPreviewView: new CardPreview(templates.cardTemplatePreview, event),
    formContacts: new FormContacts(templates.contactsTemplate),
    formOrder: new FormOrder(templates.orderTemplate),
}





const presenterGallery = new PresenterGalleryCatalog(
    api,
    views,
    templates
    event,
    containers,
    models: {
        cartModel: cartModel,
        productModel: productModel,
        customerModel: customerModel,
    }
)

presenterGallery.init()
event.on('modal:close', () => {
    modalView.closeModal()
})

/*this.event.on('card:select', (data: { id: string}) => {
    this.onCardClick(data.id);
});*/