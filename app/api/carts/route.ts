import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET(req: any) {

    const values = doSign()

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Cart[]>>>({
            method: 'GET',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/carts',
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        console.info(err)
        throw err
    }
}
