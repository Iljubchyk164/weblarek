import {ensureElement} from "../../../../utils/utils.ts";
import {Form, IValidate} from "../FormView.ts";


interface IValidateContacts extends IValidate {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IValidateContacts> {

    private formEmail: HTMLInputElement;
    private formPhone: HTMLInputElement;


    constructor(container: HTMLElement) {
        super(container);
        this.formEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.formPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    getFormData(): Partial<IValidateContacts> {
        return {
            email: this.formEmail?.value.trim() || '',
            phone: this.formPhone?.value.trim() || ''
        };
    }

    setEmail(value: string): void {
        this.formEmail.value = value;
    }

    setPhone(value: string): void {
        this.formPhone.value = value;
    }

    updateModal(validation: IValidateContacts): void {
        super.updateModal(validation);
    }
}