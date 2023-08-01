import axios from "axios";
import { Article, ArticleFilters } from "../types/Article.ts";
import _ from "lodash";

export async function fetchArticles(page: number = 1, filters: ArticleFilters = {}) {
  const query = {
    ...filters,
    categories: filters.categories?.join(","),
    authors: filters.authors?.join(","),
    sources: filters.sources?.join(","),
  };
  const articles = await axios.get(
    `${import.meta.env.VITE_REST_API}articles`,
    { params: { ...query, page } }
  );
  return articles.data as Article[];
}

export async function fetchArticleDetail(id: number) {
  const article = await axios.get(`${import.meta.env.VITE_REST_API}article/${id}`);
  return article.data as Article;
}

export async function fetchArticleMeta<T>(resourceType: string, page: number, keyword: string) {
  const resources = await axios.get(
    import.meta.env.VITE_REST_API + resourceType,
    { params: { keyword, page } }
  );
  return resources.data as T[];
}