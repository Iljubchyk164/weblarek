import {Component} from "../base/Component.ts";

interface IGalleryData {
    catalog: HTMLElement[];
}

export class GalleryView extends Component<IGalleryData> {

    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}