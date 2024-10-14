declare namespace COMServiceDispatch {

    type Props = {
        open?: boolean,
        id?: string,
        onSuccess?: () => void,
        onCancel?: () => void,
    }

    type Submit = {
        id?: string,
        company?: string,
        no?: string,
        remark?: string,
    }

    type Form = {
        user?: string,
        phone?: string,
        address?: string,
        company?: string,
        no?: string,
        remark?: string,
    }

}