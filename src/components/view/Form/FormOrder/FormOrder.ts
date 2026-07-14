import {ensureElement} from "../../../../utils/utils.ts";
import {Form, IValidate} from "../FormView.ts";
import {TPayment} from "../../../../types";


interface IValidateOrder extends IValidate {
    address: string;
    payment: TPayment;
}

export class FormOrder extends Form<IValidateOrder> {

    private formAddress: HTMLInputElement;
    private paymentButtons: HTMLElement;


    constructor(container: HTMLElement) {
        super(container);
        this.paymentButtons = ensureElement<HTMLElement>('.order__buttons', this.container);
        this.formAddress = ensureElement<HTMLInputElement>('.form__input', this.container);
    }

    getFormData(): Partial<IValidateOrder> {
        let payment: TPayment = '';
        this.paymentButtons.querySelectorAll('button').forEach(button => {
            if (button.classList.contains('active')) {
                payment = button.name as 'card' | 'cash';
            }
        });

        return {
            address: this.formAddress?.value.trim() || '',
            payment
        };
    }

    setAddress(value: string): void {
        this.formAddress.value = value;
    }

    setPayment(method: TPayment): void {
        this.paymentButtons.querySelectorAll('button').forEach(button => {
            button.classList.toggle('active', button.name === method);
        });
    }

    updateModal(validation: IValidateOrder): void {
        super.updateModal(validation);
    }
}