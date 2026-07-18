import {ensureElement} from "../../../../utils/utils.ts";
import {FormView, IValidate} from "../FormView.ts";
import {TPayment} from "../../../../types";
import {EventEmitter} from "../../../base/Events.ts";


interface IValidateOrder extends IValidate {
    address: string;
    payment: TPayment;
}

export class FormOrder extends FormView<IValidateOrder> {

    private formAddress: HTMLInputElement;
    private paymentButtons: HTMLElement;
    private orderButton: HTMLButtonElement;
    private event: EventEmitter;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.paymentButtons = ensureElement<HTMLElement>('.order__buttons', this.container);
        this.formAddress = ensureElement<HTMLInputElement>('.form__input', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.event = event

        this.paymentButtons.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            if (target.tagName === 'BUTTON' && target.name) {
                this.event.emit('payment:selected', { method: target.name as TPayment});
            }
        })

        this.formAddress.addEventListener('input', () => {
            this.event.emit('address:written', {address: this.formAddress.value});
        })

        this.orderButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.event.emit('nextOrderModal')
        })
    }

    setAddress(address: string): void {
        this.formAddress.value = address;
    }

    setPayment(method: TPayment): void {
        this.paymentButtons.querySelectorAll('button').forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }

    updateModal(validation: IValidate): void {
        super.updateModal({
            isValid: validation.isValid,
            errors: validation.errors,
        });
    }
}