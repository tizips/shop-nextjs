import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET(req: Request) {

    const values = doSign()

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Wishlists[]>>>({
            method: 'GET',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: '/shop/wishlists',
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        console.info(err)
        throw err
    }
}
