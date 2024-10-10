declare namespace APICheckout {

    type Total = {
        total: number;
        subtotal: number;
    }

    type Product = {
        id: string;
        product: string;
        price: number;
        quantity: number;
        total?: number;
    }

    type Coupon = {
        open?: boolean;
        code?: string;
        money?: number;
    }

    type Submit = {
        payment?: 'paypal';
        shipping?: number;
        coupon?: string;
        first_name?: string;
        last_name?: string;
        company?: string;
        country?: string;
        prefecture?: string;
        city?: string;
        street?: string;
        detail?: string;
        postcode?: string;
        phone?: string;
        email?: string;
        remark?: string;
    }

    type Form = {
        payment?: 'paypal';
        shipping?: number;
        coupon?: string;
        first_name?: string;
        last_name?: string;
        company?: string;
        country?: string;
        prefecture?: string;
        city?: string;
        street?: string;
        detail?: string;
        postcode?: string;
        phone?: string;
        email?: string;
        remark?: string;
    }

}