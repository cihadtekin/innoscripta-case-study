import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Article } from "../types/Article";
import { fetchArticleDetail } from "../services/articles";
import moment from "moment";
import LoadingSpinner from "../components/LoadingSpinner";

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams();
  const [loading, setLoading] = useState(false);
  if (!articleId) {
    throw new Error("Article id required");
  }

  const [article, setArticleDetail] = useState<Article|null>(null);
  const id = parseInt(articleId);

  useEffect(() => {
    fetchArticleDetailData(id);
  }, [id]);

  const fetchArticleDetailData = async (articleId: number) => {
    setLoading(true);
    const data = await fetchArticleDetail(articleId);
    setArticleDetail(data);
    setLoading(false);
  }

  if (!article) {
    return loading && <div className="text-center mb-4"><LoadingSpinner /></div>;
  }

  const goBack = () => window.history.back();

  return (
    <>
      <button onClick={goBack} className="btn btn-secondary mb-4 btn-lg">Go back</button>

      <div className="card mb-5">
        <div className="card-header">
          <h5>{article.title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{article.categories.map(i => i.name).join(", ")}</h6>
        </div>

        <img src={article.image} />

        <div className="card-body article-detail">
          <div className="clearfix mb-4">
            {moment(article.publication_date).fromNow()}
            <b className="ms-1">by {article.authors.map(i => i.name).join(", ")}</b>
            <Link to={article.source.url} className="float-end d-inline-block" target="_blank">
              {article.source.name}
            </Link>
            <Link to={article.link} className="card-link float-end me-2" target="_blank">
              Source
            </Link>
          </div>

          <p className="card-text font-size-sm mb-1" dangerouslySetInnerHTML={{__html: article.content}}></p>
        </div>
      </div>
    </>
  )
}

export default ArticleDetail;