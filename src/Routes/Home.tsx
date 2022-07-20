import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    background-color: black;
    height: 500vh;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ), url(${(props)=> props.bgPhoto});
    background-size: cover;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;

`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    height: 200px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 18px;
    }
`

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x:0,
    },
    exit: {
        x: -window.outerWidth - 5
        //화면 밖으로 나가는 항목과 다음으로 나오는 항목이 붙어 있기 떄문에 gap 만큼 거리를 넓혀준다
    }
}

const BoxVariants = {
    normal:{
        scale:1,
        
    },
    hover:{
        
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            type: "tween",
            duration: 0.3
        }
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            type: "tween",
            duration: 0.3
        }
    }
}

const offset = 6;


function Home(){
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if(data){
            //연속 클릭 시 배열 간 간격차가 많이 나는 오류를 해결하기 위한 코드
            if(leaving) return;
            const totalMovies = data?.results.length - 1; //이미 영화 하나는 사용하고 있기 때문에 -1을 해준다
            setLeaving(true);
            const maxIndex = Math.floor(totalMovies / offset) - 1; //페이지가 0에서 시작하기때문에 -1을 해줘서 총 페이지 값을 맞쳐준다
            setIndex((prev) => prev == maxIndex ? 0 : prev + 1)
        }
    };
    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    }
    
    return(
        <Wrapper>
            {isLoading ? <Loader></Loader> : 
            <>
                <Banner onClick={incraseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <Slider>
                                    {/*애니메이션이 끝났을때 일어남 */}
                    <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                        <Row 
                            key={index} 
                            variants={rowVariants} 
                            animate="visible"
                            initial="hidden"
                            exit="exit"
                            transition={{type: "tween", duration:1}}
                        >
                            {/*이미 사용한 영화를 제외하고 영화를 총 6개씩 구분하기 위한 코드 */}
                            {data?.results.slice(1).slice(offset* index, offset*index+ offset)
                            .map( (movie) => (
                                <Box 
                                    key={movie.id} 
                                    bgPhoto={makeImagePath(movie?.backdrop_path, "w500")}
                                    variants={BoxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    transition={{type: "tween"}}
                                >
                                    <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>
                    </AnimatePresence>
                </Slider>
            </>}
        </Wrapper>
    )
}
export default Home;