import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function PUT(req: Request, route: { params: { id: string } }) {

    const values = doSign()

    try {

        const body = await req.json()

        const response = await Axios().request<any, AxiosResponse<API.Response<API.Auth>>>({
            method: 'PUT',
            headers: {
                Authorization: req.headers.get('Authorization'),
            },
            url: `/shop/carts/${route.params.id}`,
            params: new URLSearchParams(values),
            data: body,
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
