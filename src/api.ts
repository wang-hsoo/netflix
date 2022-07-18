const API_KEY = "d715ceec7c486156939aed65c955d710";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
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