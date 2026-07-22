import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";
import {TBuyerErrors} from "../../../types";

export interface IValidate {
    valid: boolean;
    errors: TBuyerErrors;
}

export abstract class FormView<T extends IValidate> extends Component<T> {

    protected formButton: HTMLButtonElement;
    protected formError: HTMLSpanElement;
    protected formElement: HTMLFormElement;


    protected constructor(container: HTMLElement) {
        super(container);
        this.formElement = this.container as HTMLFormElement;
        this.formButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
        this.formError = ensureElement<HTMLSpanElement>('.form__errors', this.container);
    }

    set valid(value: boolean) {
        this.formButton.disabled = !value;
    }

    set errors(value: TBuyerErrors) {
        this.formError.textContent = Object.values(value).join(', ');
    }
}