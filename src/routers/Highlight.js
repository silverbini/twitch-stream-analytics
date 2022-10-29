import { makeVideoDataByVideoId, makeHighlightByVideoId } from '../api';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Link, useParams } from "react-router-dom";

function Highlight() {
    const { videoId } = useParams();

    const { data: makeData } = useQuery(['review', 'make_video_data', videoId, 'list'], () => makeVideoDataByVideoId(videoId))
    const { data: highlightData } = useQuery(['review', 'highlight_data', videoId, 'list'], () => makeHighlightByVideoId(videoId))
    const [hightlight, sethighlight] = useState([])
    const highLight = () => {
        sethighlight(highlightData)
    }
    console.log(highlightData)
    return (
        <div>
            <h1>하이라이트</h1>
            <p>링크를 클릭하면 해당페이지로 이동합니다</p>

            <highLight />


            {
                highlightData &&
                highlightData.map((it) => (
                    <div>
                        <h3>{it.start_time}~{it.end_time} -&gt; <a href={it.link} target="_blank" >{it.link}</a></h3>
                    </div>
                ))
            }


        </div>
    )


}
export default Highlight