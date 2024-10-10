import styles from './page.module.scss';

import Forget from '@/components/auth/forget';

export default function () {


    return (
        <div className={styles.main}>
            <h4>Please follow the prompts to retrieve your password</h4>
            <p>Please enter your email address to get the verification code</p>
            <div className={styles.container}>
                <Forget/>
            </div>
        </div>
    )
}