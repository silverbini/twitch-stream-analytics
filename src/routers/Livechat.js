import { useRef, useState, useEffect } from 'react'
import { makeUserDataByUserId, makeLiveChatDataByUserId } from '../api';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import './Livechat.css';

function Livechat() {
    const { userId } = useParams();
    const [chatType, setChatType] = useState('all')
    const { data: Liveserver } = useQuery(['review', 'make_user_data', userId, 'list'], () => makeUserDataByUserId(userId))
    const { data: LivechatData, isLoading } = useQuery(['review', 'live_chat_data', userId, 'list'], () => makeLiveChatDataByUserId(userId), {
        refetchInterval: 5000
    })


    // 전체는 all
    // 나머지는 타입별정


    const showAll = (event) => {
        event.preventDefault()
        // 
        setChatType('all')
    }

    const showEmotion = (event) => {
        event.preventDefault()
        setChatType('emotion')
    }

    const showPositiveOrNone = (event) => {
        event.preventDefault()
        setChatType('positive_or_none')
    }
    const showNegative = (event) => {
        event.preventDefault()
        setChatType('negative')
    }
    const showQuestion = (event) => {
        event.preventDefault()
        setChatType('question')
    }

    if (isLoading) {
        return <></>
    }

    return (
        <div>
            <h1>LIVE CHAT</h1>
            <h3>{userId}님의 실시간 채팅 정보입니다.</h3>
            <div >
                <ul class="navbar-nav mr-auto">
                    <li className='Menu'>
                        <a onClick={showAll}>전체</a></li>
                    <li className='Menu'>
                        <a onClick={showEmotion}>감정만</a></li>
                    <li className='Menu'>
                        <a onClick={showPositiveOrNone}>긍정+없음</a></li>
                    <li className='Menu'>
                        <a onClick={showNegative}>부정</a></li>
                    <li className='Menu'>
                        <a onClick={showQuestion}>질문</a></li>
                </ul>

                {LivechatData?.map(({ chat_nickname, chat_comment, chat_emotion }) => {
                    if (chatType === 'all') {
                        return <div>{chat_nickname}:{chat_comment} -&gt;{chat_emotion}</div>
                    }
                    if (chatType === 'emotion') {
                        return <div>{chat_emotion}</div>
                    }
                    if (chatType === 'positive_or_none') {
                        if (chat_emotion === '긍정' || chat_emotion === '없음') {
                            return <div>{chat_nickname}:{chat_comment} -&gt;{chat_emotion}</div>
                        }
                        return null
                    }
                    if (chatType === 'negative') {
                        if (chat_emotion === '부정') {
                            return <div>{chat_nickname}:{chat_comment} -&gt;{chat_emotion}</div>
                        }
                        return null
                    }
                    if (chatType === 'question') {
                        if (chat_emotion === '질문') {
                            return <div>{chat_nickname}:{chat_comment} -&gt;{chat_emotion}</div>
                        }
                        return null
                    }
                }
                )}
            </div>
        </div>
    )


}
export default Livechat