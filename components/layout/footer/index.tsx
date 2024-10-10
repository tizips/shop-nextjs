import Link from "next/link";
import {doSetting} from "@/app/actions/setting";

import styles from './index.module.scss';

export default async function () {

    const setting = await doSetting()

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <ul>
                    <li>
                        <Link href='/pages/customer-service'>Customer Service</Link>
                    </li>
                    <li>
                        <Link href='/pages/printing-and-embroidery'>Printing and embroidery</Link>
                    </li>
                    <li>
                        <Link href='/pages/frequently-asked-questions'>Frequently Asked Questions</Link>
                    </li>
                    <li>
                        <Link href='/pages/delivery-time-and-costs'>Delivery time and costs</Link>
                    </li>
                    <li>
                        <Link href='/pages/privacy-policy'>Privacy Policy</Link>
                    </li>
                    <li>
                        <Link href='/pages/warranty'>Warranty</Link>
                    </li>
                    <li>
                        <Link href='/pages/returns'>Returns</Link>
                    </li>
                    <li>
                        <Link href='/pages/cookies'>Cookies</Link>
                    </li>
                </ul>
                {
                    setting['slogan'] &&
                    <p>{setting['slogan']}</p>
                }
                {
                    setting['email'] &&
                    <>
                        <p>Should you have any questions, please feel free to send us an email by clicking the email
                            link
                            below.</p>
                        <p>E-Mail:<span>{setting['email']}</span></p>
                    </>
                }
                <ol>
                    <li>
                        <img src='/static/icon/paypal.png' alt='paypal'/>
                    </li>
                </ol>
            </div>
        </div>
    )
}