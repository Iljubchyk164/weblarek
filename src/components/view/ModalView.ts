import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {EventEmitter} from "../base/Events.ts";

interface IModalData {
    content: HTMLElement;
}

export class ModalView extends Component<IModalData> {

    private modalCloseButton: HTMLButtonElement;
    private modalContentContainer: HTMLElement;
    private event: EventEmitter;


    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContentContainer = ensureElement<HTMLElement>('.modal__content', this.container)
        this.event = event;

        this.modalCloseButton.addEventListener('click', () => {
            this.event.emit('modal:close');
        })

        this.container.addEventListener('click', (event: Event) => {
            if (event.target === this.container) {
                this.event.emit('modal:close');
            }
        })
    }

    setContent(content: HTMLElement) {
        this.modalContentContainer.replaceChildren(content)

    }

    closeModal() {
        this.modalContentContainer.innerHTML = '';
        this.container.classList.remove('modal_active');
    }

    openModal() {
        this.container.classList.add('modal_active');
    }
}