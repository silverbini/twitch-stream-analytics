import axios from 'axios'


// http://210.102.178.99:8000/review/emotion_chart_data/1627629551/


const httpRequest = axios.create({
    baseURL: 'http://127.0.0.1:8010',
    withCredentials: true
})
export const getChartDataByVideoId = async (videoId) => {
    const { data } = await httpRequest.get(`/review/emotion_chart_data/${videoId}`)
    
    return data
}

export const makeChartDataByVideoId =async (videoId)=>{
    const {data} = await httpRequest.get(`/review/make_data/${videoId}`)
    return data
}
