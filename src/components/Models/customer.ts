import {IBuyer, TBuyerErrors, TPayment} from '../../types' ;

export class Customer{

    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setPayment(payment: TPayment) {
      this.payment = payment
    }

    setEmail(email: string) {
      this.email = email
    }

    setPhone(phone: string) {
      this.phone = phone
    }

    setAddress(address: string) {
      this.address = address
    }

    getCustomer(): IBuyer {
      return {
        payment: this.payment,
        email: this.email,
        phone: this.phone,
        address: this.address
      }
    }

    clearCustomer() {
      this.payment = ''
      this.email = ''
      this.phone = ''
      this.address = ''
    }

    validateOrder(): TBuyerErrors {
        const customerErrors: TBuyerErrors = {};
        if (!this.payment) {
            customerErrors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address || this.address.trim() === '') {
            customerErrors.address = 'Укажите адрес доставки';
        }

        return customerErrors;
    }

    validateContacts(): TBuyerErrors {
        const customerErrors: TBuyerErrors = {};
        if (!this.email || this.email.trim() === '') {
            customerErrors.email = 'Укажите email';
        }
        if (!this.phone || this.phone.trim() === '') {
            customerErrors.phone = 'Укажите телефон';
        }

        return customerErrors;
    }

    validate(): TBuyerErrors {
        const customerErrors: TBuyerErrors = {
            ...this.validateOrder(),
            ...this.validateContacts()
        };
        return customerErrors;
    }
}
