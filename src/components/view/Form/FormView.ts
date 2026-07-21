import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";
import {TBuyerErrors} from "../../../types";

export interface IValidate {
    isValid: boolean;
    errors: TBuyerErrors;
}

export class FormView<T extends IValidate> extends Component<T> {

    protected formButton: HTMLButtonElement;
    protected formError: HTMLSpanElement;
    protected formElement: HTMLFormElement;


    constructor(container: HTMLElement) {
        super(container);
        this.formElement = this.container as HTMLFormElement;
        this.formButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
        this.formError = ensureElement<HTMLSpanElement>('.form__errors', this.container);

        this.disabled = true;
    }

    private set disabled(isValid: boolean) {
        this.formButton.disabled = isValid;
    }

    private set errors(errors: TBuyerErrors) {
        this.formError.textContent = Object.values(errors).length > 0 ? Object.values(errors).join(', ') : ''
    }

    protected updateModal(validation: IValidate): void {
        this.disabled = !validation.isValid;
        this.errors = validation.errors;
    }
}