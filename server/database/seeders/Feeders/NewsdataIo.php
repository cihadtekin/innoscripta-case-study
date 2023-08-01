<?php

namespace Database\Seeders\Feeders;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class NewsdataIo
{
  /**
   * Fetch $n news from newsdata.io 
   */
  static function fetch($n = 20)
  {
    $config = Config::get("news_feeders")["newsdata_io"];
    $articles = [];

    $query = [
      "language" => "en",
      "domain" => join(",", array_keys($config["source_map"])),
      "apikey" => $config["api_key"],
      "page" => NULL,
    ];

    // make requests until the $articles buffer is full
    while (count($articles) < $n)
    {
      $response = Http::get("https://newsdata.io/api/1/news", $query)->json();
      $query["page"] = $response["nextPage"];

      // map the results
      foreach ($response["results"] as $article)
      {
        // just in case:
        $source = isset($config["source_map"][$article["source_id"]]) ? $config["source_map"][$article["source_id"]] : NULL;
        // telegraph might not have description and content:
        $description = $article["description"] ? $article["description"] : $article["title"];
        $content = $article["content"] ? $article["content"] : $description;
        // cbsnews might not have a creator. fallback to source:
        $creators = is_array($article["creator"]) && count($article["creator"]) ? $article["creator"] : [$source . " editor"];
        $authors = [];
        foreach ($creators as $creator) {
          $authors = array_merge($authors, Helpers::parseAuthorsFromByline($creator));
        }


        $isValid = $source
          && $article["title"]
          && count($article["category"]) > 0
          && $article["pubDate"]
          && $article["image_url"]
          && $article["link"];
        
        if (!$isValid) {
          continue;
        }

        $articles[] = [ 
          "external_id" => $article["link"],
          "source" => $source,
          "authors" => $authors,
          "categories" => array_map(fn($v) => ucwords($v), $article["category"]),
          "publication_date" => $article["pubDate"],
          "title" => $article["title"],
          "description" => $description,
          "content" => $content,
          "link" => $article["link"],
          "image" => $article["image_url"],
        ];
      }
    }

    return array_slice($articles, 0, $n);
  }
}

