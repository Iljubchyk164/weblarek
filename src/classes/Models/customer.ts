import {IBuyer, TPayment} from '../../types/index.ts' ;

export class Customer implements IBuyer{

    payment: TPayment = '';
    email: string = '';
    phone: string = '';
    address: string = '';

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

    validate(): Record<string, string> | null {
        const CustomerErrors: Record<string, string> = {};
        if (!this.payment) {
            CustomerErrors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address || this.address.trim() === '') {
            CustomerErrors.address = 'Укажите адрес доставки';
        }
        if (!this.email || this.email.trim() === '') {
            CustomerErrors.email = 'Укажите email';
        }
        if (!this.phone || this.phone.trim() === '') {
            CustomerErrors.phone = 'Укажите телефон';
        }

        return Object.keys(CustomerErrors).length > 0 ? CustomerErrors : null;
    }
}
