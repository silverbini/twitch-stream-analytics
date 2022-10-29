import axios from 'axios'


// http://210.102.178.99:8000/review/emotion_chart_data/1627629551/



const httpRequest = axios.create({
    baseURL: 'http://ec2-15-164-64-90.ap-northeast-2.compute.amazonaws.com:8080',
    withCredentials: true
})
export const getChartDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/emotion_chart_data/${videoId}`)

    return data
}

// (쓸 일 없음) Video ID를 넘겨 다시보기 차트 데이터를 생성한다.
export const makeChartDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/make_chart_data/${videoId}`)
    return 'true'
}

export const getReviewChatDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/review_chat_data/${videoId}`)

    return data
}

// User ID를 넘겨 채팅 서버와 연결하도록 한다
export const makeUserDataByUserId = async (userId) => {
    const { data } = await httpRequest.get(`/review/make_user_data/${userId}`)
    return data
}

// 연결된 채팅 서버 내용을 받아온다
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