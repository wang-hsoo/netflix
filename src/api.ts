const API_KEY = "d715ceec7c486156939aed65c955d710";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    name: string;
    overview: string;
    vote_average:number;
    vote_count:number;
    }

export interface IGetMoviesResult{
    dates: {
        maximum: string;
        minimum: string;
        };
        page: number;
        results: IMovie[];
        total_pages: number;
        total_results: number;
}

export async function getMovies() {
    return await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  }



  export interface IGetTvResult{
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
  }

  export async function getTv (){
    return await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then(
      (response) => response.json()
    );
  }

  export interface ISearchMovie{
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
  } 
 

  export async function searchMovie(keyword:string){
    return await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`).then(
      (response) => response.json()
    );
  }