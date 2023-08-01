import React from "react";
import { Article } from "../types/Article";
import { Link } from 'react-router-dom';
import moment from "moment";

interface ArticleCardInput {
  article: Article,
}

const ArticleCard: React.FC<ArticleCardInput> = ({ article }) => {
  return (
    <>
      <div className="card card-thumbnail">
        <div className="embed-responsive embed-responsive-4by3">
          <img src={article.image} className="card-img-top embed-responsive-item" />
        </div>
        <div className="card-body">
          <h5 className="card-title text-truncate">{article.title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary text-truncate">{article.categories.map(i => i.name).join(", ")}</h6>
          <p className="card-text font-size-sm mb-1" dangerouslySetInnerHTML={{__html: article.description}}></p>
          <small className="text-body-secondary d-block text-truncate mb-4 text-right">by {article.authors.map(i => i.name).join(", ")}</small>

          <Link to={`/article/${article.id}`} className="btn btn-primary">Details</Link>
          <Link to={article.link} className="card-link float-end" target="_blank">
            Source
          </Link>
        </div>
        <div className="card-footer text-truncate">
          <small className="text-body-secondary">
            {moment(article.publication_date).fromNow()}
            <Link to={article.source.url} className="float-end d-inline-block" target="_blank">
              {article.source.name}
            </Link>
          </small>
        </div>
      </div>
    </>
  )
}

export default ArticleCard;