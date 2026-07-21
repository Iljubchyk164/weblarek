import {IBuyer, TBuyerErrors, TPayment} from '../../types' ;
import {EventEmitter} from "../base/Events.ts";

export class Customer{

    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(private event: EventEmitter) {}

    setPayment(payment: TPayment) {
      this.payment = payment
      this.event.emit('customer:updated')
    }

    setEmail(email: string) {
      this.email = email
      this.event.emit('customer:updated')
    }

    setPhone(phone: string) {
      this.phone = phone
      this.event.emit('customer:updated')
    }

    setAddress(address: string) {
      this.address = address
      this.event.emit('customer:updated')
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
      this.event.emit('customer:updated')
    }

    validate(): TBuyerErrors {
        const customerErrors: TBuyerErrors = {};
        if (!this.payment) {
            customerErrors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address || this.address.trim() === '') {
            customerErrors.address = 'Укажите адрес доставки';
        }
        if (!this.email || this.email.trim() === '') {
            customerErrors.email = 'Укажите email';
        }
        if (!this.phone || this.phone.trim() === '') {
            customerErrors.phone = 'Укажите телефон';
        }
        return customerErrors;
    }
}
