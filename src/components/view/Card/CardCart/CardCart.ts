import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";

interface ICardCartData extends ICardData {
    index: number;
}

export class CardCart extends Card<ICardCartData> {

    private cardIndex: HTMLSpanElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, cb: () => void) {
        super(container);
        this.cardIndex = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            cb()
    })
    }
    set content(data: ICardCartData) {
        super.content = data;
        this.cardIndex.textContent = String(data.index);
    }
}