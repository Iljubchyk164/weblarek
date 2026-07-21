import {ensureElement} from "../../../../utils/utils.ts";
import {FormView, IValidate} from "../FormView.ts";
import {EventEmitter} from "../../../base/Events.ts";


interface IValidateContacts extends IValidate {
    email: string;
    phone: string;
}

export class FormContacts extends FormView<IValidateContacts> {

    private formEmail: HTMLInputElement;
    private formPhone: HTMLInputElement;
    private submitButton: HTMLButtonElement;

    private event: EventEmitter;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.formEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.formPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.event = event

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.event.emit('form:submit');
        })

        this.formEmail.addEventListener('input', () => {
            this.event.emit('email:written', {email: this.formEmail.value});
        })

        this.formPhone.addEventListener('input', () => {
            this.event.emit('phone:written', {phone: this.formPhone.value});
        })
    }

    set email(email: string) {
        this.formEmail.value = email;
    }

    set phone(phone: string) {
        this.formPhone.value = phone;
    }

    updateModal(validation: IValidate): void {
        super.updateModal(validation);
    }
}