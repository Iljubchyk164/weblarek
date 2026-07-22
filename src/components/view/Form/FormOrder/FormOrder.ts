import {ensureAllElements, ensureElement} from "../../../../utils/utils.ts";
import {FormView, IValidate} from "../FormView.ts";
import {TPayment} from "../../../../types";
import {EventEmitter} from "../../../base/Events.ts";


interface IValidateOrder extends IValidate {
    address: string;
    payment: TPayment;
}

export class FormOrder extends FormView<IValidateOrder> {

    private formAddress: HTMLInputElement;
    private paymentButtonsList: HTMLButtonElement[];
    private orderButton: HTMLButtonElement;
    private event: EventEmitter;

    constructor(container: HTMLElement, event: EventEmitter) {
        super(container);
        this.paymentButtonsList = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
        this.formAddress = ensureElement<HTMLInputElement>('.form__input', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.event = event

        this.paymentButtonsList.forEach(button => button.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            if (target.tagName === 'BUTTON' && target.name) {
                this.event.emit('payment:selected', { method: target.name as TPayment});
            }
        }))

        this.formAddress.addEventListener('input', () => {
            this.event.emit('address:written', {address: this.formAddress.value});
        })

        this.orderButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.event.emit('form:openNextForm')
        })
    }

    set address(address: string) {
        this.formAddress.value = address;
    }

    set payment(method: TPayment) {
        this.paymentButtonsList.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }
}