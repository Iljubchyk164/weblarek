import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";

interface ICartData {
    price: number;
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
            this.event.emit('order')
        })

        this.disabledButton(true)
    }

    setPrice(value: number) {
        this.cartPrice.textContent = `${value} синапсов`
    }

    setList(item: HTMLElement) {
        this.cartList.append(item);
    }

    disabledButton(bool: boolean) {
        this.cartButton.disabled = bool
    }
}