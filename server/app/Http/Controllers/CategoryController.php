<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Searches in authors. Querystring parameters:
     *   page:       Number
     *   keyword:    String
     */  
    function search(Request $request)
    {
        $params = $request->all();
        $listSize = 10;
        $keyword = $params["keyword"] ?? NULL;

        $query = Category::where("id", ">", 0);

        if ($keyword) {
            $query->where("name", "like", "%" . $keyword . "%");
        }

        $query->skip((($params["page"] ?? 1) - 1) * $listSize)->limit($listSize);

        $results = $query->get();
        return $results->toJson();
    }
}
