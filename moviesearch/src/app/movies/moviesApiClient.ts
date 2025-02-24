"use server"

import { Movie } from "../types/Movie";

export async function getMovies(title: string): Promise<Movie[]> {
    const response = await fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&s=${title}`);
    const data = await response.json();
    const movies = data.Search as Movie[];
    return movies;
}
