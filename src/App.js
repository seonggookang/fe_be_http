import React, { useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const alreadyMovies = JSON.parse(localStorage.getItem('items'));
  const [movies, setMovies] = useState(alreadyMovies ? alreadyMovies : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  // function fetchMoviesHandler() {
  //   fetch('https://swapi.dev/api/films/').then(res => {
  //     return res.json();
  //   }).then(data => {
  //     const transformedMovies = data.results.map(movieData => {
  //       return {
  //         id: movieData.episode_id,
  //         title: movieData.title,
  //         openingText: movieData.opening_crawl,
  //         releaseDate: movieData.release_date,
  //       }
  //     })
  //     setMovies(transformedMovies);
  //   });// fetch 는 프로미스라는 객체를 반환
  // }

  // 비동기 처리
  // async를 사용 안하고 then 을 사용한다면 catch를 이용해서 error를 잡아야함
  // async를 사용한다면 try catch를 이용
  async function fetchMoviesHandler() { // 함수 앞에 async 키워드를 추가
    setLoading(true);
    setError(null); // 그전에 받았었을수도 있는 에러를 없애는 처리
    try {
      const response = await fetch('https://swapi.dev/api/films/') // 프로미스 반환 함수 앞에 await
      
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      
      const data = await response.json();
      const transformedMovies = data.results.map(movieData => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      } 
    })
    setMovies(transformedMovies);
    localStorage.setItem('items', JSON.stringify(transformedMovies));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  } 

  function deleteHandler() {
    // localStorage.setItem('items', []);
    setMovies([]);
    localStorage.removeItem('items');
  }

  let content = <p>Found no movies.</p>

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={deleteHandler}>Delete everything</button>
      </section>
      <section>
        {!loading && movies.length === 0 && !error && <p>nothing</p>}
        {loading ? 'loading...' : <MoviesList movies={movies} />}
        {!loading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
