import { useEffect, useState } from 'react'
import Portal from './components/Portal'
import Modal from './components/Modal/Modal'
import axios from 'axios'
import './App.css'
import detail from "./routers/Details";
import Livechat from "./routers/Livechat";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";




function Homes() {
    const [videoData, setVideoData] = useState(null)
    const [videoId, setVideoId] = useState(() => sessionStorage.getItem('videoId') ?? '')
    const [isLoading, setLoading] = useState(false)
    const [isError, setError] = useState(false)

    const [userId, setuserId] = useState(() => sessionStorage.getItem('userId') ?? '')


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





    const getVideoData = async () => {

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
            setVideoData(response.data.data[0]);

            setError(false)
        } catch (err) {
            setError(true)
        } finally {

            setLoading(false)
            sessionStorage.removeItem('videoId')


            window.history.pushState('', '', null)
        }
    }






    return (
        <div className='App'>
            <h1 className="title">
                Twitch Korea Streaming Manager
            </h1>

            <div>  <input className="id-input" placeholder="video Id??? ??????????????????" value={videoId} onChange={(e) => setVideoId(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    getVideoData()
                }
            }} />
                <button className="data-button" onClick={getVideoData}>??????</button> </div>




            {isLoading

                ? <h1 className='fbox'>Loading..</h1>
                : isError
                    ?
                    <h4 className='fbox' style={{ color: '#b20a2c', fontSize: '25px' }}> Error</h4>
                    : <div >
                        <div className='box'>
                            {videoData && (
                                <>
                                    <div>???????????? ??????: {videoData?.user_name}</div>
                                    <div>????????????: {videoData?.title}</div>
                                    <div>?????????: {videoData?.view_count}</div>
                                    <div>?????????: {videoData?.created_at}</div>
                                </>
                            )}
                        </div>
                        {videoData && (
                            <div className="statics-button-box">
                                <button className='data-button' onClick={() => {


                                    if (!videoId) {
                                        alert('????????? id??? ??????????????????.')
                                        return
                                    }
                                    sessionStorage.setItem('videoId', videoId)
                                    navigate(`/detail/${videoId}`)
                                }}>??????</button>
                                <button type="button" className='data-button' onClick={() => {
                                    if (!videoId) {
                                        alert('????????? id??? ??????????????????.')
                                        return
                                    }
                                    sessionStorage.setItem('videoId', videoId)
                                    navigate(`/Highlight/${videoId}`)
                                }}>???????????????</button>
                            </div>
                        )}
                    </div>
            }


            <div>
                <h1 className="sil">Live Chat</h1>
                <input className="userid-input" placeholder="user Id??? ??????????????????" value={userId} onChange={(e) => setuserId(e.target.value)} />

                <button className="data-button" onClick={() => {
                    if (!userId) {
                        alert('userID ??? ??????????????????.')
                        return
                    }
                    sessionStorage.setItem('userId', userId)
                    navigate(`/Livechat/${userId}`)
                }} >??????</button>


            </div>
        </div>



    )
}

export default Homes