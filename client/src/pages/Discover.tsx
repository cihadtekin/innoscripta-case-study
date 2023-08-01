import React, { useEffect, useState } from "react";
import { fetchArticles } from "../services/articles";
import { Article, ArticleFilters } from "../types/Article";
import ArticleCard from "../components/ArticleCard";
import { TagInput } from "../components/TagInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from '../store';
import { User, UserState } from "../types/User";
import { updatePreferences } from "../services/user";

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filters, setFilters] = useState<ArticleFilters>({ keyword: "" });
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cannotSave, setCannotSave] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector<{ user: UserState }>((state) => state.user.user) as User;

  useEffect(() => {
    setPage(1);
    fetchFilteredArticles(1, filters);
    setSaved(false);
  }, [filters]);

  const fetchFilteredArticles = async (page: number, filters: ArticleFilters) => {
    setLoading(true);
    const data = await fetchArticles(page, filters);
    setArticles(data);
    setLoading(false);
  }

  const fetchMoreArticles = async () => {
    setLoading(true);
    const newPage = page+1;
    setPage(newPage);
    const data = await fetchArticles(newPage, filters);
    setArticles([...articles, ...data]);
    setLoading(false);
  }

  const search = (keyword: string) => setFilters({ ...filters, keyword });

  const filter = (item: ArticleFilters) => setFilters({ ...filters, ...item })

  const saveAsPreference = async () => {
    if (!user) {
      return setCannotSave(true);
    }
    const { categories = [], authors = [], sources = [] } = filters;
    const preferences = { categories, authors, sources };
    const newUser = { ...user, preferences: JSON.stringify(preferences) }
    localStorage.setItem("user", JSON.stringify(newUser));
    dispatch(setUser(newUser));
    try {
      await updatePreferences(preferences);
      setSaved(true);
    } catch (e) {}
  }

  return (
    <>
      <div className="my-2">
        <label className="mt-2">Search in titles:</label>
        <input className="form-control " type="text" placeholder="Keyword..." onChange={e => search(e.target.value)}/>
        <label className="mt-2">Select categories:</label>
        <TagInput resourceType={"categories"} onChange={categories => filter({ categories })}/>
        <label className="mt-2">Select authors:</label>
        <TagInput resourceType={"authors"} onChange={authors => filter({ authors })} />
        <label className="mt-2">Select sources:</label>
        <TagInput resourceType={"sources"} onChange={sources => filter({ sources })} />
        <div className="text-center">
          <button className="btn btn-secondary mb-2 mt-3" onClick={() => saveAsPreference()}>
            Update my preferences with the selected criteria
          </button>
          {saved &&
            <div className="mt-2 mb-3 alert alert-success alert-dismissible">
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setSaved(false)}></button>
              Your category, author and source filters are saved. "Home" will be loaded with these criterias now.
            </div>
          }
          {cannotSave &&
            <div className="mt-2 mb-3 alert alert-danger alert-dismissible">
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setCannotSave(false)}></button>
              You need to be logged in to be able to save your preferences.
            </div>
          }
        </div>
      </div>

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