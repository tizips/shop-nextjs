declare namespace APIOrder {

    type Status = {
        icon: any;
        title: string;
        description?: any;
        status?: 'wait' | 'process' | 'finish';
    }

    type Product = {
        id: string;
        title: string;
        thumb: string;
        attr?: string;
        price: number;
        quantity: number;
    }

}