declare namespace COMAuthRegister {

    type Props = {
        loading?: boolean;
        onFinish?: (values: Form) => void;
    }

    type Form = {
        email?: string;
        first_name?: string;
        last_name?: string;
        password?: string;
        password_confirm?: string;
    }


}