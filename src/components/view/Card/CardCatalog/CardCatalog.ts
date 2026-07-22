import {ensureElement} from "../../../../utils/utils.ts";
import {Card, ICardData} from "../Card.ts";
import {categoryMap} from "../../../../utils/constants.ts";

interface ICardCatalogData extends ICardData {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogData> {

    private cardCategory: HTMLElement;
    private readonly cardImage: HTMLImageElement;
    private cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, cb: () => void ) {
        super(container);
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardButton = container as HTMLButtonElement;

        this.cardButton.addEventListener('click', (e) => {
            e.stopPropagation();
            cb()
        })
    }

    set category(value: string) {
        this.cardCategory.textContent = value;
        this.cardCategory.classList.remove(
            'card__category_soft',
            'card__category_hard',
            'card__category_button',
            'card__category_additional',
            'card__category_other'
        );
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.cardCategory.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        this.setImage(this.cardImage, value);
    }
}