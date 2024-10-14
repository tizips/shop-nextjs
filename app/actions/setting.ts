import {Axios, doSign} from "@/service/request";
import {AxiosResponse} from "axios";
import Constants from "@/util/Constants";

export async function doSetting() {

    let data: Record<string, string> = {}

    let search = new URLSearchParams({module: 'shop'})

    const values = doSign(search.toString())

    try {

        const response = await Axios().get<any, AxiosResponse<API.Response<Record<string, string>>>>('/common/setting', {params: new URLSearchParams(values)})

        if (response.data.code == Constants.Success) {
            data = response.data.data
        }

    } catch (err) {
    }

    return data
}