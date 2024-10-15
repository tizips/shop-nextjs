import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET(req: Request) {

    const values = doSign()

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Paypal>>>({
            method: 'GET',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/payment/channel',
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (e) {
        throw e
    }

}