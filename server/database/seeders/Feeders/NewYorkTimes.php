<?php

namespace Database\Seeders\Feeders;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class NewYorkTimes
{
  /**
   * Fetch $n news from New York Times
   */
  static function fetch($n = 20)
  {
    $config = Config::get("news_feeders")["new_york_times"];
    $sourceName = "New York Times";
    $articles = [];

    $query = [ "api-key" => $config["api_key"] ];
    $response = Http::get("https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json", $query)->json();

    // map the results
    foreach ($response["results"] as $article)
    {
      $authors = Helpers::parseAuthorsFromByline($article["byline"]);

      if (!count($authors)) {
        $authors = [$sourceName . " editor"];
      }

      $category = $article["subsection"] ? $article["subsection"] : $article["section"];

      $image = NULL;
      $media = is_array($article["media"]) ? $article["media"] : [];
      $media = array_filter($media, fn($v) => $v["type"] === "image");
      if (count($media) && isset($media[0]["media-metadata"])) {
        $media_meta = $media[0]["media-metadata"];
        if (is_array($media_meta)) {
          uasort($media_meta, fn($a, $b) => $b["width"] - $a["width"]);
          $image = reset($media_meta)["url"];
        }
      }

      $isValid = $category
        && $image
        && $article["id"]
        && $article["title"]
        && $article["updated"]
        && $article["abstract"]
        && $article["url"];
      
      if (!$isValid) {
        continue;
      }

      $articles[] = [
        "external_id" => $article["id"],
        "source" => $sourceName,
        "authors" => $authors,
        "categories" => [$category],
        "publication_date" => $article["updated"],
        "title" => $article["title"],
        "description" => $article["abstract"],
        "content" => $article["abstract"],
        "link" => $article["url"],
        "image" => $image,
      ];
    }

    return array_slice($articles, 0, $n);
  }
}

