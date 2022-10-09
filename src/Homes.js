import { useEffect, useState } from 'react'
import Portal from './components/Portal'
import Modal from './components/Modal/Modal'
import axios from 'axios'
import './App.css'
import detail from "./routers/Details";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";


const 비동기함수 = async () => { }
async function 비동기함수1() {

}

function Homes() {
    const [videoData, setVideoData] = useState(null)
    const [videoId, setVideoId] = useState(() => sessionStorage.getItem('videoId') ?? '')
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)


    // 페이지 이동을 가능하게 해주는 함수 -> useNavigate의 return 값으로 전달받아서 사용

    // navigate(url: string) -> 페이지 이동 === <Link to={url} />와 같음
    const navigate = useNavigate()

    useEffect(() => {
        const handlePopstate = (event) => {
            if (videoId) {
                setVideoId('')
            }
            if (videoData) {
                setVideoData(null)
            }
        }

        window.addEventListener('popstate', handlePopstate)
        return () => window.removeEventListener('popstate', handlePopstate)
    }, [videoId, videoData])

    useEffect(() => {
        if (sessionStorage.getItem('videoId')) {
            getVideoData()
        }
    }, [])



    // API를 호출하면 -> 데이터를 불러오는 시간이 있음 -> 로딩 중인지 몰랐음

    const getVideoData = async () => {
        // try 내부에 있는 코드에서 에러가 났을 때
        // await -> 기다리다
        // Promise -> 3가지 상태 1.대기중 2. 성공 3.실패
        // await 비동기함수 -> 변수에 담을거야
        setLoading(true)
        try {
            const { data: accessData } = await axios.post(
                'https://id.twitch.tv/oauth2/token?client_id=01gir5cvc2bgckgag0wl0iowz923ll&client_secret=elari5ml66zjc9dpcn1y47jsnic30w&grant_type=client_credentials'
            )
            const response = await axios.get(`https://api.twitch.tv/helix/videos?id=${videoId}`, {
                headers: {
                    Authorization: `Bearer ${accessData.access_token}`,
                    'Client-Id': '01gir5cvc2bgckgag0wl0iowz923ll',
                },
            })
            setVideoData(response.data.data[0]); // 화면에 반영될 때까지
            // catch안에있는 함수가 동작한다.
            setError(false)
        } catch (err) {
            setError(true)
        } finally {
            // 성공을 하든, 에러가 뜨든 무조건 실행하는 코드 블럭
            // 에러가 뜨든, 성공을 하든 로딩은 완료가 되어야하니깐
            setLoading(false)
            sessionStorage.removeItem('videoId')

            // 가짜 이동 상태
            window.history.pushState('', '', null)
        }
    }


    // state값이 변경될 때 rerendering이 된다 
    // props가 바뀌었을 때 -> 나중
    // 부모컴포넌트가 리렌더링됐을 때 -> 나중 



    return (
        <div className='App'>
            <h1 className="title">Welcome</h1>
            <input className="id-input" placeholder="video Id를 입력해주세요" value={videoId} onChange={(e) => setVideoId(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    getVideoData()
                }
            }} />
            <button className="data-button" onClick={getVideoData}>입력</button>
            <h4> 채팅로그</h4>


            {/* 자바스크립트 코드를 쓸 수 있다. */}
            {isLoading

                ? <h1 className='fbox'>로딩 중입니다...</h1>
                : isError
                    ?
                    <h4 className='fbox' style={{ color: 'red' }}>에러가 발생했습니다. </h4>
                    : <div >
                        <div className='box'>
                            {videoData && (
                                <>
                                    <div>스트리머이름: {videoData?.user_name}</div>
                                    <div>방송 제목: {videoData?.title}</div>
                                    <div>조회수: {videoData?.view_count}</div>
                                    <div>생성일: {videoData?.created_at}</div>
                                </>
                            )}
                        </div>
                        {videoData && (
                            <div className="statics-button-box">
                                <button className='statics' onClick={() => {

                                    // 세션 스토리지에(탭을 닫을때 까지 유지되는 스토리지(서버 <-> 클라) 저장
                                    if (!videoId) {
                                        alert('비디오 id를 입력해주세요.')
                                        return
                                    }
                                    sessionStorage.setItem('videoId', videoId)
                                    navigate(`/detail/${videoId}`)
                                }}>통계</button>
                                <button type="button" className='statics' onClick={() => {
                                    if (!videoId) {
                                        alert('비디오 id를 입력해주세요.')
                                        return
                                    }
                                    sessionStorage.setItem('videoId', videoId)
                                    navigate(`/Highlight/${videoId}`)
                                }}>하이라이트</button>
                            </div>
                        )}
                    </div>
            }


        </div>



    )
}

export default Homes