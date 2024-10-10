import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doPage(code: string) {

    let search = new URLSearchParams()

    search.set('code', code)

    const values = doSign(search.toString())

    let data: API.Page | undefined

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<API.Page>>>('/shop/page/code', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}