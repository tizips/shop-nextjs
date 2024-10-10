import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doAdvertise(page: string, block: string) {

    let params = new URLSearchParams()

    params.set('page', page)
    params.set('block', block)

    const values = doSign(params.toString())

    let data: API.Advertises[] = []

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Advertises[]>>>('/shop/advertises', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}