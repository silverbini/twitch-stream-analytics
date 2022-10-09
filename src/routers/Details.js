import { useEffect, useState } from 'react'
import { findRenderedComponentWithType } from "react-dom/test-utils";
import React, { PureComponent } from 'react';
import { useParams } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { render } from "@testing-library/react";
import './Details.css'
import Portal from '../components/Portal'
import Modal from '../components/Modal/Modal'






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




const Chart = () => {


    return (

        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="#3a7bd5" activeDot={{ r: 8 }} /> //stroke : 선의 색상, activeDot : 그래프에 마우스를 올릴 시 원의 스타일 설정
            <Line type="monotone" dataKey="negative" stroke="#ef473a" />
            <Line type="monotone" dataKey="question" stroke="#7F00FF" />
            <Line type="monotone" dataKey="neutrality" stroke="#d9a7c7" />


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


    // videoId가져오기
    const { videoId } = useParams();

    // 통계 모달 상태 관리
    const [isOpenedStatisticsModal, setOpenedStatisticsModal] = useState(false)

    // 하이라이트 모달
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
        const selectedData = data.find(item => item.name === selectedTime)
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

        return `${firstSelectionPercent.toFixed(2)}% : ${secondSelectionPercent.toFixed(2)}%`
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

    return (
        <div className="detail-container">
            <div className="statistics-container">
                <h1>{"<시간대별 채팅 감정 분석>"}</h1>
                <Chart />
                <h5 className="notice">notice: x축의 시간은 방송 시간이 아닌 경과된 시간을 기준으로 함  ex) 04:00 -&gt; 시작한지 4시간 경과<br />
                    y축의 수치는 1시간 단위의 누적된 데이터를 말함 ex) 04:00 -&gt; 03:00 ~ 04:00 동안의 데이터
                </h5>
                <div className="detail">
                    <button type="button" onClick={() => setOpenedStatisticsModal(true)}>방송 정보 보기</button>
                </div>
            </div>
            <div className="ratio-statistics-container">
                <h1>-감정비율 알아보기</h1>
                <div className="radio-statistics-body">
                    <div className="filter">
                        <div className='option'>
                            <select name="choice" onChange={handleTime}>
                                {data.map(item => {
                                    return <option value={item.name}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="checkboxes">
                            <label>
                                <input
                                    type="checkbox"
                                    name="test"
                                    value="positive"
                                    checked={selectedFeelings.includes('positive')}
                                    onChange={handleSelectedFeeling} />positive
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="negative" checked={selectedFeelings.includes('negative')} onChange={handleSelectedFeeling} />negative
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="question" checked={selectedFeelings.includes('question')} onChange={handleSelectedFeeling} />question
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="neutrality" checked={selectedFeelings.includes('neutrality')} onChange={handleSelectedFeeling} />neutrality
                            </label>
                            <label>
                                <input type="checkbox" name="test" value="total" checked={selectedFeelings.includes('total')} onChange={handleSelectedFeeling} />total
                            </label>
                        </div>
                    </div>
                    <div className='result'>
                        <div>{selectedFeelings[0] && `선택된 감정 1: ${selectedFeelings[0]}`}</div>
                        <div>{selectedFeelings[1] && `선택된 감정 2: ${selectedFeelings[1]}`}</div>
                        {selectedTime
                            ? selectedFeelings.length >= 2
                                ? <div>
                                    <div>{getValue(selectedFeelings[0])}</div>
                                    <div>{getValue(selectedFeelings[1])}</div>
                                    <div>{getPercentageRadio()}</div>
                                </div>
                                : <div>감정을 모두 선택해주세요.</div>
                            : <div>시간을 선택해주세요.</div>}
                    </div>
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
                                        <div className='broinfo'>{"<방송 정보>"}</div> <br />
                                        <div className='inter'>
                                            <p>비디오 아이디 :   </p><br />
                                            <p>스트리머이름:   </p><br />
                                            <p>방송제목:       </p><br />
                                            <p>방송날짜:     </p><br />
                                            <p>조회수:     </p><br />
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