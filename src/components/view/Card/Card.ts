import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";

export interface ICardData {
    title: string;
    price: number | null;
}

export abstract class Card<T extends ICardData> extends Component<T> {

    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;



    protected constructor(container: HTMLElement) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected setContent(data: T) {
        this.cardTitle.textContent = data.title;
        this.cardPrice.textContent = `${data.price ? data.price : 0} синапсов`
    }
}