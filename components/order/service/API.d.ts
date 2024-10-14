declare namespace COMOrderService {

    type Props = {
        open?: boolean,
        id: string,
        status: string,
        details: API.Detail[],
        onSuccess?: () => void,
        onCancel?: () => void,
    }

    type Submit = {
        id: string,
        type: 'un_receipt' | 'refund' | 'exchange',
        reason?: string,
        pictures: string[],
        details: {
            id: string,
            quantity: number,
        }[],
    }

    type Form = {
        type: 'un_receipt' | 'refund' | 'exchange',
        pictures: any[],
        reason?: string,
        details: {
            id: string,
            quantity: number,
        }[],
    }

}