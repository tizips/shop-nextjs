import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doProducts(params: URLSearchParams) {

    let data: API.Paginate<API.Products> = {
        page: 1,
        size: 15,
        total: 0,
        data: [],
    }

    const values = doSign(params.toString())

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Paginate<API.Products>>>>('/shop/products', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}

export async function doProductOfHot() {

    let data: API.Products[] = []

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Products[]>>>('/shop/product/hot', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}

export async function doProductOfRecommended() {

    let data: API.Products[] = []

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Products[]>>>('/shop/product/recommended', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}

export async function doProductOfInformation(id: string) {

    let data: API.Product | undefined

    const values = doSign()

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Product>>>(`/shop/products/${id}`, {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}

export async function doProductOfSpecification(id: string) {

    const query = new URLSearchParams()

    query.set('id', id)

    const values = doSign(query.toString())

    let data: API.Specification | undefined

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Specification>>>('/shop/product/specification', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}