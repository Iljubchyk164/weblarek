import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";

interface ICardCatalogData extends ICardData {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogData> {

    private cardCategory: HTMLElement;
    private cardImage: HTMLImageElement;



    constructor(container: HTMLElement) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    setContent(data: ICardCatalogData) {
        super.setContent(data);
        this.cardCategory.textContent = data.category;
        this.cardImage.src = data.image;
        return this.container
    }
}