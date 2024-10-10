import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doSEO(channel: string, id: string) {

    const query = new URLSearchParams()

    query.set('channel', channel)
    query.set('id', id)

    const values = doSign(query.toString())

    let data: API.SEO | undefined

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.SEO>>>('/shop/seo', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}