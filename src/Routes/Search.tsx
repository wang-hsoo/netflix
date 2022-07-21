import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
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
    const location = useLocation();
    //지금 이용하고 있는 곳에 관한 정보를 얻을 수 있음
    const keyword = new URLSearchParams(location.search).get("keyword");
    const {data, isLoading} = useQuery<ISearchMovie>(["search"],() => searchMovie(keyword+""));

    console.log(data);
   
    

    return(
        <Wrapper>
            {isLoading ? <Loader>Movie Loading</Loader> :
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
                        // onClick={() => onBoxClicked(movie.id)}
                    >
                    <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                    </Info>
                </Box>
                ))}
            </List>
            }
        </Wrapper>
    )
}
export default Search;