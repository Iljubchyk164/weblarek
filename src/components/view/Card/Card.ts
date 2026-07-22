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

    protected set title(value: string) {
        this.cardTitle.textContent = value;
    }

    protected set price(value: number | null) {
        this.cardPrice.textContent = value !== null ?
            `${value} синапсов`
            : `Бесценно`
    }
}