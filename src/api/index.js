import axios from 'axios'






const httpRequest = axios.create({
    baseURL: 'http://ec2-15-164-64-90.ap-northeast-2.compute.amazonaws.com:8080',
    withCredentials: true
})
export const getChartDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/emotion_chart_data/${videoId}`)

    return data
}


export const makeChartDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/make_chart_data/${videoId}`)
    return 'true'
}

export const getReviewChatDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/review_chat_data/${videoId}`)

    return data
}


export const makeUserDataByUserId = async (userId) => {
    const { data } = await httpRequest.get(`/review/make_user_data/${userId}`)
    return data
}


export const makeLiveChatDataByUserId = async (userId) => {


    const { data } = await httpRequest.get(`/review/live_chat_data/${userId}`)
    return data
}
export const makeVideoDataByVideoId = async (videoId) => {

    const { data } = await httpRequest.get(`/review/make_video_data/${videoId}`)
    return data
}
export const makeHighlightByVideoId = async (videoId) => {


    const { data } = await httpRequest.get(`/review/highlight_data/${videoId}`)
    return data
}