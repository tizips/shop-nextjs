import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET(req: Request) {

    const url = new URL(req.url);

    const values = doSign(url.searchParams.toString())

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Orders[]>>>({
            method: 'GET',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/orders',
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        throw err
    }
}
