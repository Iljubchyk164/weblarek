import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";

interface ICardCartData extends ICardData {
    index: number;
}

export class CardCart extends Card<ICardCartData> {

    private cardIndex: HTMLSpanElement;



    constructor(container: HTMLElement) {
        super(container);
        this.cardIndex = ensureElement<HTMLSpanElement>('.card__item-index', this.container);
    }

    setContent(data: ICardCartData) {
        super.setContent(data);
        this.cardIndex.textContent = String(data.index);
    }
}