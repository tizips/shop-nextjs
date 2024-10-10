declare namespace COMAuthLogin {

    type Props = {
        loading?: boolean;
        onFinish?: (values: Form) => void;
    }

    type Form = {
        email?: string;
        password?: string;
    }


}