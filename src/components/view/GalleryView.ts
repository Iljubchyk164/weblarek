import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";

interface IGalleryData {
    catalog: HTMLElement[];
}

export class GalleryView extends Component<IGalleryData> {

    private catalogElement: HTMLElement;



    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = ensureElement<HTMLElement>('.gallery')
    }

    setCatalog(items?: HTMLElement[]) {
        if (items) {
            this.catalogElement.innerHTML = "";
            this.catalogElement.append(...items)
        } else {
            this.catalogElement.innerHTML = "";
        }

    }
}