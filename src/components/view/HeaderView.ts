import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";

interface IHeaderData {
    counter: number;
}

export class HeaderView extends Component<IHeaderData> {

    private headerCartButton: HTMLButtonElement;
    private cartCounterText: HTMLSpanElement;
    private event: EventEmitter;


    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.headerCartButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.cartCounterText = ensureElement<HTMLSpanElement>('.header__basket-counter', this.container)
        this.event = event


        this.headerCartButton.addEventListener('click', () => {
            this.event.emit('header:openCart')
        })
    }

    set counter(value: number) {
        this.cartCounterText.textContent = String(value);
    }
}