import React, { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useQuery, useMutation } from 'react-query';
import { useParams } from "react-router-dom";
import {
    Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis,
    YAxis
} from "recharts";
import { getChartDataByVideoId, makeChartDataByVideoId, getReviewChatDataByVideoId } from '../api';
import Modal from '../components/Modal/Modal';
import Portal from '../components/Portal';
import './Details.css';






const data = [
    {
        name: '00:00', positive: 0, negative: 0, question: 0, neutrality: 0, total: 0,

    },
    {
        name: '01:00', positive: 509, negative: 113, question: 151, neutrality: 930, total: 1703,

    },
    {
        name: '02:00', positive: 1629, negative: 344, question: 260, neutrality: 930, total: 6185,
    },
    {
        name: '03:00', positive: 826, negative: 150, question: 128, neutrality: 1178, total: 8467,

    },
    {
        name: '04:00', positive: 1957, negative: 324, question: 279, neutrality: 2440, total: 13467,

    },
    {
        name: '05:00', positive: 2737, negative: 396, question: 288, neutrality: 3011, total: 19899,
    },
    {
        name: '06:00', positive: 2283, negative: 415, question: 272, neutrality: 3587, total: 29968,
    },
    {
        name: "07:00", positive: 799, negative: 130, question: 150, neutrality: 1333, total: 28868,
    },
    {
        name: '08:00', positive: 813, negative: 168, question: 244, neutrality: 1531, total: 31624,
    }



];

const bardata = [

    {
        name: "01:00",
        "number of viewers": 1500
    },
    {
        name: "02:00",
        "number of viewers": 3000
    },
    {
        name: "03:00",
        "number of viewers": 4300
    },
    {
        name: "04:00",
        "number of viewers": 6300
    },
    {
        name: "05:00",
        "number of viewers": 6000
    },
    {
        name: "06:00",
        "number of viewers": 4500
    },
    {
        name: "07:00",
        "number of viewers": 3400
    },
    {
        name: "08:00",
        "number of viewers": 3214
    },
];








const Chart = ({ chartData }) => {


    return (

        <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="review_time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive_chat_count" stroke="#3a7bd5" activeDot={{ r: 8 }} /> //stroke : 선의 색상, activeDot : 그래프에 마우스를 올릴 시 원의 스타일 설정
            <Line type="monotone" dataKey="negative_chat_count" stroke="#ef473a" />
            <Line type="monotone" dataKey="question_chat_count" stroke="#7F00FF" />
            <Line type="monotone" dataKey="neturality_chat_count" stroke="#d9a7c7" />


        </LineChart>



    );
}
const Barchartt = () => {
    return (
        <BarChart width={500} height={300} data={bardata}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="number of viewers" fill="#8884d8" />

        </BarChart>
    );
}





function Details() {


    // videoId가져오
    const { videoId } = useParams();
    console.log(videoId)

    const sequentialSetting = async (videoId) => {
        await getReviewChatDataByVideoId(videoId)
        getChartDataByVideoId(videoId)

    }

    const { data: reviewChat, refetch } = useQuery(['review', 'review_chat_data', videoId, 'list'], () => getReviewChatDataByVideoId(videoId), {
        enabled: false,
    })

    const { data: chartData } = useQuery(['review', 'emotion_chart_data', videoId, 'list'], () => getChartDataByVideoId(videoId), {
        onSuccess: async () => {
            await refetch()
        }
    })


    console.log(chartData)
    console.log(reviewChat)


    const [isOpenedStatisticsModal, setOpenedStatisticsModal] = useState(false)


    const [isOpenedHighLightModal, setOpenedHighLightModal] = useState(false)

    const [selectedTime, setSelectedTime] = useState(null)

    const handleTime = (event) => {
        setSelectedTime(event.target.value)
    }

    const [selectedFeelings, setSelectedFeelings] = useState([])

    const handleSelectedFeeling = (event) => {
        if (selectedFeelings.includes(event.target.value)) {
            const newFeelings = selectedFeelings.filter(item => item !== event.target.value)
            setSelectedFeelings(newFeelings)
            return
        }

        if (selectedFeelings.length >= 2) {
            alert('최대 2개만 선택할 수 있습니다.')
            return
        }

        setSelectedFeelings([...selectedFeelings, event.target.value])
    }


    function getValue(feeling) {
        const selectedData = chartData.find(item => item.review_time === selectedTime)
        return selectedData[feeling]
    }

    function getPercentageRadio() {
        if (selectedFeelings.length !== 2 || selectedTime === null) {
            return
        }
        const firstFeelingAmount = getValue(selectedFeelings[0])
        const secondFeelingAmount = getValue(selectedFeelings[1])
        const total = firstFeelingAmount + secondFeelingAmount
        const firstSelectionPercent = firstFeelingAmount / total * 100
        const secondSelectionPercent = secondFeelingAmount / total * 100

        console.log(firstSelectionPercent.toFixed(0));

        return firstSelectionPercent.toFixed(0)

    }









    useEffect(() => {
        const handleEscapeModal = (e) => {
            if (e.key === 'Escape') {
                if (isOpenedHighLightModal) {
                    setOpenedHighLightModal(false)
                }
                if (isOpenedStatisticsModal) {
                    setOpenedStatisticsModal(false)
                }
            }
        }
        window.addEventListener('keydown', handleEscapeModal)
        return () => window.removeEventListener('keydown', handleEscapeModal)
    }, [isOpenedHighLightModal, isOpenedStatisticsModal])

    const Pie = () => {
        const piedata =
            [{ title: `${selectedFeelings[0]}`, value: getPercentageRadio(), color: '#f5af19', },
            { title: `${selectedFeelings[1]}`, value: 100 - getPercentageRadio(), color: '#f12711' }];
        return (
            <PieChart
                data={piedata}
                label={({ dataEntry }) => dataEntry.value}
                totalValue={100}
                radius={40}
                lineWidth={100}
                labelStyle={(index) => ({
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                })}

            />
        );
    };



    const [chartViewData, setchartViewData] = useState([])

    const handleChartData = () => {

        setchartViewData(chartData)
    }






    const [reviewChatting, setreviewChatting] = useState()
    const reviewchat = () => {
        setreviewChatting(reviewChat)

    }






    return (
        <div className="detail-container">
            <div className="statistics-container">
                <h1>{"<시간대별 채팅 감정 분석>"}</h1>
                <p>다시보기 채팅</p>
                <div>시간:닉네임&gt; 채팅&gt; 감정</div>
                <div className='chatlog'>
                    <div>


                        {reviewChat &&
                            reviewChat.map((it) => (
                                <div>

                                    <div>{it.chat_time_min}.{it.chat_time_sec} : {it.chat_nickname}  &gt; {it.chat_comment} &gt; {it.chat_emotion}</div>

                                </div>
                            ))

                        }
                    </div>
                </div>
                <button onClick={handleChartData}>차트조회</button>
                <Chart chartData={chartViewData} />

                <div className="detail">
                    <button type="button" onClick={() => setOpenedStatisticsModal(true)}>notice</button>
                </div>
            </div>
            <div className="ratio-statistics-container">
                <h1>-감정비율 알아보기</h1>
                <div className="radio-statistics-body">
                    <div className="filter">
                        <div className='option'>
                            <select name="choice" onChange={handleTime}>
                                {chartData && chartData.map(item => {
                                    return <option value={item.review_time}>{item.review_time}</option>
                                })}

                            </select>
                        </div>
                        <div className="checkboxes">
                            <label>
                                <input
                                    type="checkbox"
                                    name="test"
                                    value="positive_chat_count"
                                    checked={selectedFeelings.includes('positive_chat_count')}
                                    onChange={handleSelectedFeeling} />positive
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="negative_chat_count" checked={selectedFeelings.includes('negative_chat_count')} onChange={handleSelectedFeeling} />negative
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="question_chat_count" checked={selectedFeelings.includes('question_chat_count')} onChange={handleSelectedFeeling} />question
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="neturality_chat_count" checked={selectedFeelings.includes('neturality_chat_count')} onChange={handleSelectedFeeling} />neutrality
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="total_chat_count" checked={selectedFeelings.includes('total_chat_count')} onChange={handleSelectedFeeling} />total
                            </label>

                        </div>

                    </div>

                    <div className='result'>


                        {selectedTime
                            ? selectedFeelings.length >= 2
                                ? <div>
                                    <div>{selectedFeelings[0] && `${selectedFeelings[0]} : ${getValue(selectedFeelings[0])} `}</div>
                                    <div>{selectedFeelings[1] && `${selectedFeelings[1]} :${getValue(selectedFeelings[1])}`}</div>
                                </div>
                                : <div>감정을 모두 선택해주세요.</div>
                            : <div>시간을 선택해주세요.</div>}
                        <div className='pie'><Pie /></div>


                    </div>
                </div>
                <div>부정 채팅</div>
                <div className='negativeBox'>
                    {reviewChat && reviewChat.map(data => {
                        if (data.chat_emotion === "부정")
                            return <div>{data.chat_time_min}.{data.chat_time_sec} &gt;{data.chat_nickname} &gt; {data.chat_comment}</div>;
                    })}
                </div>
                <div>질문 채팅</div>
                <div className='negativeBox'>
                    {reviewChat && reviewChat.map(data => {
                        if (data.chat_emotion === "질문")
                            return <div>{data.chat_time_min}.{data.chat_time_sec} &gt;{data.chat_nickname} &gt; {data.chat_comment}</div>;
                    })}
                </div>
            </div>
            {
                isOpenedStatisticsModal && (
                    <Portal>
                        <Modal>
                            <div className='statics-modal'>
                                <div className='statics-modal-header'>
                                    <div>
                                        <div className='close-button' onClick={() => setOpenedStatisticsModal(false)}>X</div>
                                        <div className='broinfo'>{"<notice>"}</div> <br />
                                        <div className='inter'>
                                            <p>notice: x축의 시간은 방송 시간이 아닌 경과된 시간을 기준으로 함  ex) 04:00 -&gt; 시작한지 4시간 경과<br />
                                                y축의 수치는 1시간 단위의 누적된 데이터를 말함 ex) 04:00 -&gt; 03:00 ~ 04:00 동안의 데이터</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </Portal>
                )
            }
        </div >
    )
}

export default Details