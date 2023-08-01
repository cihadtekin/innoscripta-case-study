<?php

namespace Database\Seeders\Feeders;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class TheGuardian
{
  /**
   * Fetch $n news from The Guardian
   */
  static function fetch($n = 20)
  {
    $config = Config::get("news_feeders")["the_guardian"];
    $sourceName = "The Guardian";
    $articles = [];

    $query = [
      "api-key" => $config["api_key"],
      "show-fields" => "body,thumbnail,headline,trailText,byline",
      "show-references" => "author",
      "page-size" => max($n, 50),
      "page" => 1
    ];

    // make requests until the $articles buffer is full
    while (count($articles) < $n)
    {
      $response = Http::get("https://content.guardianapis.com/search", $query)->json();
      $query["page"]++;

      // map the results
      foreach ($response["response"]["results"] as $article)
      {
        $authors = Helpers::parseAuthorsFromByline($article["fields"]["byline"] ?? "");
        if (!count($authors)) {
          $authors = [$sourceName . " editor"];
        }

        $isValid = isset($article["id"]) && $article["id"]
          && isset($article["fields"]["trailText"]) && $article["fields"]["trailText"]
          && isset($article["fields"]["body"]) && $article["fields"]["body"]
          && isset($article["sectionName"]) && $article["sectionName"]
          && isset($article["webTitle"]) && $article["webTitle"]
          && isset($article["webPublicationDate"]) && $article["webPublicationDate"]
          && isset($article["fields"]["thumbnail"]) && $article["fields"]["thumbnail"]
          && isset($article["webUrl"]) && $article["webUrl"];
        
        if (!$isValid) {
          continue;
        }

        $articles[] = [
          "external_id" => $article["id"],
          "source" => $sourceName,
          "authors" => $authors,
          "categories" => [$article["sectionName"]],
          "publication_date" => $article["webPublicationDate"],
          "title" => $article["webTitle"],
          "description" => $article["fields"]["trailText"],
          "content" => $article["fields"]["body"],
          "link" => $article["webUrl"],
          "image" => $article["fields"]["thumbnail"],
        ];
      }
    }

    return array_slice($articles, 0, $n);
  }
}

