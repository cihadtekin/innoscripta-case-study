<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Searches in articles. Querystring parameters:
     *   page:       Number
     *   keyword:    String
     *   start:      Date string
     *   end:        Date string
     *   sources:    Comma separated ids
     *   categories: Comma separated ids
     *   authors:    Comma separated ids
     */  
    function search(Request $request)
    {
        $params = $request->all();
        $listSize = 10;
        $startDate = $params["start"] ?? NULL;
        $endDate = $params["end"] ?? NULL;
        $keyword = $params["keyword"] ?? NULL;
        $categories = parseArrayParams($params["categories"] ?? "");
        $authors = parseArrayParams($params["authors"] ?? "");
        $sources = parseArrayParams($params["sources"] ?? "");

        $query = Article::where("id", ">", 0);

        if ($keyword) {
            $query->where("title", "like", "%" . $keyword . "%");
        }
        if ($startDate) {
            $query->where("publication_date", ">", $startDate);
        }
        if ($endDate) {
            $query->where("publication_date", "<", $endDate);
        }
        if (count($sources)) {
            $query->whereIn("source_id", $sources);
        }
        if (count($categories)) {
            $query->whereHas("categories", function($query) use ($categories) {
                $query->whereIn("categories.id", $categories);
            });
        }
        if (count($authors)) {
            $query->whereHas("authors", function($query) use ($authors) {
                $query->whereIn("authors.id", $authors);
            });
        }

        $query->orderByDesc("publication_date");
        $query->skip((($params["page"] ?? 1) - 1) * $listSize)->limit($listSize);

        $results = $query->get();
        return $results->toJson();
    }

    function detail(Request $request)
    {
        $id = $request->route("id");
        return Article::find($id)->toJson();
    }
}

function parseArrayParams($param) {
    $arr = explode(",", $param);
    $arr = array_map(fn($v) => trim($v), $arr);
    return array_filter($arr);
}