import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { url } from "inspector";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import next from "../img/next.png";
import prev from "../img/prev.png";

const Wrapper = styled.div`
    background-color: black;
    
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
    cursor: pointer;
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

const Overlay = styled(motion.div)`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    position: fixed;
`
const BigMovie = styled(motion.div)`      
    position:absolute;
    width:40vw; 
    height: 80vh; 
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 50px;
    overflow: hidden;
    background-color: ${props => props.theme.black.veryDark};
`
const BigCover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center center;
    
`

const BigTitle = styled.h3`
    color: ${props => props.theme.white.lighter};
    padding: 20px;
    font-size: 45px;
    position: relative;
    top: -80px;
`

const BigOverView = styled.div`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${props => props.theme.white.lighter};
`

const NowMovie = styled.h3`
    font-size: 20px;
`

const MovieHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0px 20px;
    margin-bottom: 15px;
`;

const SlideBtn = styled.img`
    background-color: white;
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-left: 10px;
    cursor: pointer;
`;


const rowVariants = {
    hidden: (prevCheck:boolean) => ({
      x: prevCheck ? -window.outerWidth + 5 : window.outerWidth + 5,
    }),
    visible: {
        x:0,
    },
    exit: (prevCheck:boolean) => ({
       x: prevCheck ? window.outerWidth + 5 : -window.outerWidth + 5,
    }),
    
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
    const history = useHistory();//url ?????? ???????????? ??????
    const bigMovieMath = useRouteMatch<{movieId:string}>("/movies/:movieId");//??????????????? ?????????
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] = useState(false);
    const {scrollY} = useViewportScroll();
    const [prevCheck, setPrevCheck] = useState(false);

    const incraseIndex = () => {
        
        if(data){
            //?????? ?????? ??? ?????? ??? ???????????? ?????? ?????? ????????? ???????????? ?????? ??????
            if(leaving) return;
            setPrevCheck(false);
            if(prevCheck === false)
            {const totalMovies = data?.results.length - 1; //?????? ?????? ????????? ???????????? ?????? ????????? -1??? ?????????
            setLeaving(true);
            const maxIndex = Math.floor(totalMovies / offset) - 1; //???????????? 0?????? ????????????????????? -1??? ????????? ??? ????????? ?????? ????????????
            setIndex((prev) => prev == maxIndex ? 0 : prev + 1)}
            
        }
    };

    const descendIndex = () => {
        
        if(data){
            //?????? ?????? ??? ?????? ??? ???????????? ?????? ?????? ????????? ???????????? ?????? ??????
            if(leaving) return;
            setPrevCheck(true);
            if(prevCheck===true)
            {const totalMovies = data?.results.length - 1; //?????? ?????? ????????? ???????????? ?????? ????????? -1??? ?????????
            setLeaving(true);
            const maxIndex = Math.floor(totalMovies / offset) - 1; //???????????? 0?????? ????????????????????? -1??? ????????? ??? ????????? ?????? ????????????
            setIndex((prev) => prev == 0 ? maxIndex : prev - 1);}
            
            
        }
    }

    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    }
    
    const onBoxClicked = (movieId:number) => {
        history.push(`/movies/${movieId}`);
    }

    const onOverlayCick = () => history.push("/");
    const clickMovie = 
        bigMovieMath?.params.movieId && 
        data?.results.find(movie => movie.id === +bigMovieMath.params.movieId)
        //????????? movie id??? ???????????? ?????? ????????? ?????????

    return(
        <Wrapper>
            {isLoading ? <Loader></Loader> : 
            <>
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <Slider>
                                    {/*?????????????????? ???????????? ????????? */}
                    <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                        <MovieHead>
                            <NowMovie>Now Playing</NowMovie>
                            <div>
                                <SlideBtn src={prev}  onClick={descendIndex}/>
                                <SlideBtn src={next} onClick={incraseIndex}  />
                            </div>
                        </MovieHead>
                        <Row 
                            key={index} 
                            variants={rowVariants} 
                            animate="visible"
                            initial="hidden"
                            exit="exit"
                            transition={{type: "tween", duration:1}}
                            custom={prevCheck} 
                        >
                            {/*?????? ????????? ????????? ???????????? ????????? ??? 6?????? ???????????? ?????? ?????? */}
                            {data?.results.slice(1).slice(offset* index, offset*index+ offset)
                            .map( (movie) => (
                                <Box 
                                    layoutId={movie.id+""}
                                    key={movie.id} 
                                    bgPhoto={makeImagePath(movie?.backdrop_path, "w500")}
                                    variants={BoxVariants}
                                    whileHover="hover"
                                    initial="normal"
                                    transition={{type: "tween"}}
                                    onClick={() => onBoxClicked(movie.id)}
                                    
                                >
                                    <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>
                    </AnimatePresence>
                </Slider>        
                <AnimatePresence>
                   {bigMovieMath ? ( 
                    <>
                        <Overlay 
                            onClick={onOverlayCick} 
                            animate={{opacity: 1}} 
                            exit={{opacity: 0}}
                        />
                        <BigMovie 
                            style={{top: scrollY.get() + 100}}
                            layoutId={bigMovieMath.params.movieId}
                        >
                            {clickMovie && (<>
                                <BigCover 
                                    style={{ 
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickMovie.backdrop_path, "w500")})`}} 
                                />
                                <BigTitle>{clickMovie.title}</BigTitle>
                                <BigOverView>{clickMovie.overview}</BigOverView>
                            </>)}      
                        </BigMovie>
                    </>) : null}
                </AnimatePresence>
            </>}
        </Wrapper>
    )
}
export default Home;