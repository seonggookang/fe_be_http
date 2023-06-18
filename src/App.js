import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-2ec80-default-rtdb.firebaseio.com/movies.json'); // movies는 그냥 내가 작명. 이러면 데이터베이스에 새로운 노드가 생김
       // firebase의 요구사항 : 요청을 전달하려는 url 끝에 .json 붙임
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      console.log('data>> ', data); // 결과값을 보면 key,value의 객체형식으로 가져오고 있다.
      // 적절히 변형 후 배열로 만들어야함

      const loadedMovies = [];

      for (const key in data) {
        console.log('data[key]>> ', data[key]); // response로 받은 중첩 객체를 타고 들어가게됨.
        loadedMovies.push({ // concat과의 차이 : concat은 새로 복사하여 만든다.push는 기존꺼 건드림.
          id: key,
          title: data[key].title, 
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // 비동기 작업이므로 async, await 해줘야함
  async function addMovieHandler(movie) { // fetch는 기본적으로 get이 default

    // 위에서 처럼 try-catch
    const response = await fetch('https://react-http-2ec80-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie), //자바스크립트 객체나 배열을  JSON으로 만듬. JSON 형식으로 fe <-> be 데이터교환함
      header: { // firebase 에는 안필요하다. 없어도 정상 처리해준다.하지만 rest api에서는  헤더가 필요. 이헤더를 통해 어떤 컨텐츠가 전달되는지 알 수 있다.
        'Content-Type': 'application/json'
      }
    });
    // firebase가 전달하는 데이터는 JSON형식
    const data = await response.json();
    console.log(data);
    // 버튼 클릭시 firebase에서 movies라는 노드를 볼 수 있음

  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
