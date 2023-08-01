import React, { useEffect, useState } from "react";
import { fetchArticles } from "../services/articles";
import { Article, ArticleFilters } from "../types/Article";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { User, UserState } from "../types/User";

const Home: React.FC = () => {
  const user = useSelector<{ user: UserState }>((state) => state.user.user) as User|null;
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const preferences = JSON.parse(user?.preferences || "{\"categories\":[],\"authors\":[],\"sources\":[]}");
  const filters: ArticleFilters = {...preferences};

  const fetchMoreArticles = async () => {
    setLoading(true);
    const newPage = page+1;
    setPage(newPage);
    const data = await fetchArticles(newPage, filters);
    setArticles([...articles, ...data]);
    setLoading(false);
  }

  useEffect(() => {
    fetchMoreArticles();
  }, []);

  return (
    <>
      {user && <h2>Welcome {user.name}</h2>}

      <div className="row">
        {articles.map(article => (
          <div className="col-sm-4 mb-4" key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {loading && <div className="text-center mb-4"><LoadingSpinner /></div>}

      <div className="text-center pb-5 mb-5">
        <button onClick={() => fetchMoreArticles() } className="btn btn-success btn-lg">
          Load More
        </button>
      </div>
    </>
  )
}

export default Home;