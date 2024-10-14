declare namespace API {

    type Paginate<T> = {
        total: number;
        page: number;
        size: number;
        data: T[];
    }

    type Response<T> = {
        code: number;
        message: string;
        data: T;
    }

    type Upload = {
        name: string;
        uri: string;
        url: string;
    }

    type PlaceOrder = {
        id: string;
        channel: string;
        pay_id: string;
    }

    type Auth = {
        token: string;
        lifetime: number;
    }

    type SEO = {
        title: string;
        keyword: string;
        description: string;
    }

    type Cart = {
        id: number;
        product: string;
        name: string;
        picture: string;
        specifications?: string[];
        price: number;
        quantity: number;
        is_invalid: number;
        create_at: string;
    }

    type Wishlists = {
        id: number;
        product_id: string;
        name: string;
        picture: string;
        price: number;
        created_at: string;
    }

    type Banners = {
        id: number;
        name: string;
        description?: string;
        button?: string;
        picture: string;
        target: string;
        url?: string;
        created_at: string;
    }

    type Shippings = {
        id: number;
        name: string;
        money: number;
    }

    type Page = {
        name: string;
        content: string;
    }

    type Categories = {
        id: number;
        level: string;
        name: string;
        children?: Categories[];
    }

    type Advertises = {
        id: number;
        title: string;
        thumb: string;
        target: string;
        url: string;
        created_at: string;
    }

    type Products = {
        id: string;
        name: string;
        price: number;
        origin_price?: number;
        picture: string;
        created_at: string;
    }

    type Product = {
        id: string;
        name: string;
        summary: string;
        price: number;
        origin_price?: number;
        pictures: string[];
        information: string;
        attributes: Attribute[];
        sku?: SKU;
        is_multiple: number;
        is_free_shipping: number;
        created_at: string;
    }

    type Specification = {
        id: string;
        specifications: specification[];
        skus: SKU[];
    }

    type specification = {
        id: number;
        name: string;
        options?: specification[];
    }

    type Attribute = {
        label: string;
        value?: string;
    }

    type SKU = {
        id: string;
        code?: string;
        price: number;
        origin_price?: number;
        stock: number;
        picture?: string;
    }

    type Blogs = {
        id: string;
        name: string;
        thumb: string;
        summary: string;
        posted_at: string;
        created_at: string;
    }

    type Blog = {
        id: string;
        name: string;
        thumb: string;
        summary: string;
        content: string;
        posted_at: string;
        created_at: string;
    }

    type Paypal = {
        link: string;
    }

    type Orders = {
        id: string;
        details: Detail[];
        prices: number;
        status: string;
        is_appraisal: 1 | 2;
        can_service: 1 | 2;
        create_at: string;
    }

    type Order = {
        id: string;
        details: Detail[];
        address: Address;
        payment?: Payment;
        logs: Log[];
        cost_shipping: number;
        total_price: number;
        coupon_price: number;
        refund: number;
        prices: number;
        status: 'pay' | 'shipment' | 'receipt' | 'received' | 'completed' | 'closed';
        shipping: string;
        remark: string;
        is_invoiced: 1 | 2;
        is_appraisal: 1 | 2;
        create_at: string;
    }

    type Detail = {
        id: string;
        service?: string;
        name: string;
        picture: string;
        price: number;
        quantity: number;
        prices: number;
        specifications?: string[];
        refund: number;
        returned: number;
        services: number;
    }

    type Payment = {
        id: string;
        channel: string;
        no?: string;
        paid_at?: string;
    }

    type Address = {
        first_name: string;
        last_name: string;
        company: string;
        country: string;
        prefecture: string;
        city: string;
        street: string;
        detail: string;
        postcode: string;
        phone: string;
        email: string;
    }

    type Log = {
        action: string;
        content: string;
        created_at: string;
    }

    type Services = {
        id: string;
        type: 'un_receipt' | 'refund' | 'exchange';
        status: string;
        reason: string;
        details: Detail[];
        subtotal: number;
        shipping: number;
        refund: number;
        created_at: string;
    }

    type Service = {
        id: string;
        order: string;
        type: 'un_receipt' | 'refund' | 'exchange';
        status: string;
        reason: string;
        details: Detail[];
        pictures: string[];
        logs: Log[];
        subtotal: number;
        shipping: number;
        refund: number;
        created_at: string;
    }

}