import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { ISearchMovie, searchMovie } from "../api";
import { makeImagePath } from "../utils";
import noImg from "../img/no_img.png"

const Wrapper = styled.div`
    background-color: black;
    
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const List = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 70px;
    margin-bottom: 20px;
`
const Box = styled(motion.div)<{bgPhoto:string}>`
    height: 200px;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
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

const BoxVariants = {
    normal:{
        scale:1,
        
    },
    hover:{

        scale: 1.3,
        y: 0,
        transition: {
            delay: 0.5,
            type: "tween",
            duration: 0.3,
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

function Search(){
    const history = useHistory();
    const location = useLocation();
    //지금 이용하고 있는 곳에 관한 정보를 얻을 수 있음
    const keyword = new URLSearchParams(location.search).get("keyword");
    const {data, isLoading} = useQuery<ISearchMovie>(["search","searchMovie"],() => searchMovie(keyword+""));
    const bigMovieMath = useRouteMatch<{movieId:string}>(`/search/:movieId`);
    const {scrollY} = useViewportScroll();
    const onBoxClicked = (movieId:number) => {
        history.push(`/search/${movieId}`);
    }
    const onOverlayCick = () => history.push(`/search?keyword=${keyword}`);
    const clickMovie = 
        bigMovieMath?.params.movieId && 
        data?.results.find(movie => movie.id === +bigMovieMath.params.movieId)
   
    console.log(bigMovieMath)
    return(
        <Wrapper>
            {isLoading ? <Loader>Movie Loading</Loader> :
            <>
                <List>
                
                    {data?.results?.map( (movie) => (
                        <Box 
                            layoutId={movie.id+""}
                            key={movie.id} 
                            bgPhoto={movie?.backdrop_path === null ? noImg : makeImagePath(movie?.backdrop_path, "w500")}
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
                    
                 </List>
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
            </>
            }
        </Wrapper>
    )
}
export default Search;