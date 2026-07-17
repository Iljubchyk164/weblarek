import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";
import {EventEmitter} from "../../../base/Events.ts";

interface ICardCartData extends ICardData {
    index: number;
}

export class CardCart extends Card<ICardCartData> {

    private cardIndex: HTMLSpanElement;
    private deleteButton: HTMLButtonElement;
    private event: EventEmitter;
    private cardId?: string;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.cardIndex = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.event = event;

        this.deleteButton.addEventListener('click', () => {
            this.event.emit('deleteFromCart', {id: this.cardId})
    })
    }
    setContent(data: ICardCartData) {
        super.setContent(data);
        this.cardIndex.textContent = String(data.index);
        this.cardId = data.id;
    }
}