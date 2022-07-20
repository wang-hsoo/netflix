import { useLocation } from "react-router-dom";

function Search(){
    const localtion = useLocation();
    //지금 이용하고 있는 곳에 관한 정보를 얻을 수 있음
    const keyword = new URLSearchParams(localtion.search).get("keyword");

    
    return(
        null
    )
}
export default Search;