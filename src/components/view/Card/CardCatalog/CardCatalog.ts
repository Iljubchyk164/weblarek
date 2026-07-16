import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";
import {EventEmitter} from "../../../base/Events.ts";
import {CDN_URL} from "../../../../utils/constants.ts";

interface ICardCatalogData extends ICardData {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogData> {

    private cardCategory: HTMLElement;
    private cardImage: HTMLImageElement;
    private cardButton: HTMLButtonElement;
    private event: EventEmitter;
    private cardId?: string;



    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardButton = container as HTMLButtonElement;
        this.event = event;

        this.cardButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.event.emit('card:select', {id: this.cardId})
        })
    }

    setContent(data: ICardCatalogData) {
        super.setContent(data);
        this.cardCategory.textContent = data.category;
        this.setImage(this.cardImage, `${CDN_URL}${data.image}`, data.title);
        this.cardId = data.id;
    }
}