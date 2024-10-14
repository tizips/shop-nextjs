declare namespace COMOrderFeedback {

    type Props = {
        open?: boolean,
        id: string,
        onSuccess?: () => void,
        onCancel?: () => void,
    }

    type Submit = {
        id: string,
        star_product?: number,
        star_shipment?: number,
        remark?: string,
        pictures: string[],
    }

    type Form = {
        star_product?: number,
        star_shipment?: number,
        remark?: string,
        pictures: any[],
    }

}