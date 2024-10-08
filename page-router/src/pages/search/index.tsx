import SearchableLayout from '@/components/searchable-layout';
import MovieItem from '@/components/movie-item';
import style from './index.module.css';
import { ReactNode, useEffect, useState } from 'react';
import fetchAllMovies from '@/lib/fetch-all-movies';
import { MovieData } from '@/types';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Search() {
  const [searchMovie, setSearchMovie] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllMovies(q as string);
      setSearchMovie(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (q) {
      fetchSearchResult();
    }
  }, [q]);

  if (isLoading) {
    return <div>검색중...</div>;
  }

  if (!isLoading && searchMovie.length === 0) {
    return <div>검색 결과가 없습니다</div>;
  }

  return (
    <>
      <Head>
        <title>한입 시네마 - 검색결과</title>
        <meta property='og:image' content='/thumnail.png' />
        <meta property='og:title' content='한입 시네마 - 검색결과' />
        <meta
          property='og:description'
          content='한입 시네마에 등록된 영화들을 만나보세요'
        />
      </Head>
      <div className={style.movie_list}>
        {searchMovie.map((movie) => (
          <MovieItem key={movie.id} {...movie} />
        ))}
      </div>
    </>
  );
}

Search.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
