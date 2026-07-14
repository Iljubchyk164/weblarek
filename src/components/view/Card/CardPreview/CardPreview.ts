import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";

interface ICardPreviewData extends ICardData {
    category: string;
    image: string;
    description: string;
}

export class CardPreview extends Card<ICardPreviewData> {

    private cardCategory: HTMLElement;
    private cardImage: HTMLImageElement;
    private cardDescription: HTMLElement;



    constructor(container: HTMLElement) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    }

    setContent(data: ICardPreviewData) {
        super.setContent(data);
        this.cardCategory.textContent = data.category;
        this.cardDescription.textContent = data.description;
        this.cardImage.src = data.image;
    }
}