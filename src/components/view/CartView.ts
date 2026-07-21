import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";

interface ICartData {
    price: number;
    list: HTMLElement[];
    buttonDisabled: boolean;
}

export class CartView extends Component<ICartData> {

    private cartButton: HTMLButtonElement;
    private cartPrice: HTMLSpanElement;
    private cartList: HTMLUListElement;
    private event: EventEmitter;


    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.cartButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.cartPrice = ensureElement<HTMLSpanElement>('.basket__price', this.container)
        this.cartList = ensureElement<HTMLUListElement>('.basket__list', this.container)
        this.event = event;

        this.cartButton.addEventListener('click', () => {
            this.event.emit('cart:openForm')
        })

        this.buttonDisabled = true
    }

    set price(value: number) {
        this.cartPrice.textContent = `${value} синапсов`
    }

    set list(item: HTMLElement[]) {
        this.cartList.replaceChildren(...item);
    }

    set buttonDisabled(bool: boolean) {
        this.cartButton.disabled = bool
    }
}