import { Movie } from "../types/Movie";
import styles from "./MovieList.module.css";
type MovieListProps = {
    movies: Movie[];
}
export default function MovieList({ movies }: MovieListProps) {
    return (
        <div className={styles.movielist}>
            <h2>Search result</h2>
            <div className={styles.movies}>
                {movies.map(movie => (
                    <div key={movie.imbID} className={styles.movie}>
                        <img src={movie.Poster} alt={movie.Title}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}