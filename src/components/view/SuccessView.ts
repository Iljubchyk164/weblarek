import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";

interface ISuccessData {
    price: number;
}

export class SuccessView extends Component<ISuccessData> {

    private priceDescription: HTMLElement;
    private closeButton: HTMLButtonElement;
    private event: EventEmitter;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.priceDescription = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.event = event;

        this.closeButton.addEventListener('click', () => {
            this.event.emit('modal:close');
        })
    }

    setContent(value: number) {
        this.priceDescription.textContent = `Списано ${value} синапсов`
    }
}