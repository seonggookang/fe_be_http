import React, { useEffect, useState, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const alreadyMovies = JSON.parse(localStorage.getItem('items'));
  const [movies, setMovies] = useState(alreadyMovies ? alreadyMovies : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

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
  const fetchMoviesHandler = useCallback(async () => { // 함수 앞에 async 키워드를 추가
    setLoading(true);
    setError(null); // 그전에 받았었을수도 있는 에러를 없애는 처리
    try {
      const response = await fetch('https://swapi.dev/api/films/') // 프로미스 반환 함수 앞에 await
      
      // fetch API는 이런 에러 상태 코드를 실제 에러로 인식하지 않기에 다음과 같은 절차를 밟아야함
      if (!response.ok) { // axios는 이런거 할 필요 없음 , 오류 상태 코드에 맞는 오류를 만들어서 전달해줌
        throw new Error('Something went wrong'); // 에러 던지고 나면 catch 블록으로 감
      }
      
      const data = await response.json(); // 이 파싱 전에 위와 같은 응답정상여부를 먼저 치뤄줘야함
      const transformedMovies = data.results.map(movieData => { // 비어있는걸 돌릴 때 생기는 에러가 아니라 오류 상태 코드를 받았을 때 실제 오류가 발생하게끔 처리
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
      setError(error.message); // Something went wrong
    }
    setLoading(false); // 응답이 성공이든 실패든 로딩이 필요없기에 try,catch 밖으로 뺌
  }, []);

  useEffect(() => {
    fetchMoviesHandler(); // fetchMoviesHandler상수가 파싱되기전에 호출하기때문에 에러발생, 상수 설정한 곳 아래로 위치시켜야함
  }, []); // 함수는 객체고 컴포넌트가 재렌더링 될때마다 함수 역시 바뀜. -> 무한루프 그래서 2번째 인자로 함수를 넣지 않음

  function deleteHandler() {
    // localStorage.setItem('items', []);
    setMovies([]);
    localStorage.removeItem('items');
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (loading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={deleteHandler}>Delete everything</button>
      </section>
      <section>
        {/* {!loading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {loading ? 'loading...' : <MoviesList movies={movies} />}
        {!loading && error && <p>{error}</p>} */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
