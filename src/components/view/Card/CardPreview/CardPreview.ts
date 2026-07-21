import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";
import {CDN_URL} from "../../../../utils/constants.ts";
import {EventEmitter} from "../../../base/Events.ts";

interface ICardPreviewData extends ICardData {
    category: string;
    image: string;
    description: string;
    buttonDisabled?: boolean;
    buttonText?: string;
}

export class CardPreview extends Card<ICardPreviewData> {

    private cardCategory: HTMLElement;
    private cardImage: HTMLImageElement;
    private cardDescription: HTMLElement;
    private cardButton: HTMLButtonElement;
    private event: EventEmitter;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.event = event

        this.cardButton.addEventListener('click', () => {
            this.event.emit('card:action')
        })
    }

    set content(data: ICardPreviewData) {
        super.content = data;
        this.cardCategory.textContent = data.category;
        this.cardDescription.textContent = data.description;
        this.setImage(this.cardImage, `${CDN_URL}${data.image}`, data.title);
    }

    set buttonDisabled(bool: boolean) {
        this.cardButton.disabled = bool;
    }

    set buttonText(text: string) {
        this.cardButton.textContent = text;
    }
}