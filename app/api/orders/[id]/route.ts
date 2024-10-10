import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {

    const values = doSign()

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Order>>>({
            method: 'GET',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: `/shop/orders/${route.params.id}`,
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        throw err
    }
}

export async function DELETE(req: Request, route: { params: { id: string } }) {

    const values = doSign()

    try {

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Auth>>>({
            method: 'DELETE',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: `/shop/carts/${route.params.id}`,
            params: new URLSearchParams(values),
        })

        return NextResponse.json(response.data)

    } catch (err) {
        throw err
    }
}
