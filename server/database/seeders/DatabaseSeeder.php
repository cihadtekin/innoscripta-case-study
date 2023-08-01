<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Article;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $articlesPerSource = env("ARTICLES_PER_SOURCE", 20);

        // fetch the articles
        $articles = array_merge(
            Feeders\NewsdataIo::fetch($articlesPerSource * 5),
            Feeders\NewYorkTimes::fetch($articlesPerSource),
            Feeders\TheGuardian::fetch($articlesPerSource)
        );

        // load all of the sources and index them by their names
        $sources = Source::all();
        $sourceMap = [];
        foreach ($sources as $item) {
            $sourceMap[$item->name] = $item->id;
        }

        // import all the authors and map as [name => id]
        DB::beginTransaction();
        $authorMap = [];
        foreach ($articles as $article) {
            foreach ($article["authors"] as $authorName) {
                $author = Author::firstOrCreate(["name" => $authorName]);
                $authorMap[$author->name] = $author->id;
            }
        }
        DB::commit();

        // import all the categories and map as [name => id]
        DB::beginTransaction();
        $categoryMap = [];
        foreach ($articles as $article) {
            foreach ($article["categories"] as $categoryName) {
                $category = Category::firstOrCreate(["name" => $categoryName]);
                $categoryMap[$category->name] = $category->id;
            }
        }
        DB::commit();

        // import articles
        DB::beginTransaction();
        foreach ($articles as $article) {
            $source = $sourceMap[$article["source"]];
            $categories = array_map(fn($name) => $categoryMap[$name], $article["categories"]);
            $authors = array_map(fn($name) => $authorMap[$name], $article["authors"]);

            $stored = Article::firstOrCreate(
                ["external_id" => $article["external_id"]],
                [
                    "source_id" => $source,
                    "publication_date" => $article["publication_date"],
                    "title" => $article["title"],
                    "description" => $article["description"],
                    "content" => $article["content"],
                    "link" => $article["link"],
                    "image" => $article["image"],
                ]
            );
            $stored->categories()->sync($categories);
            $stored->authors()->sync($authors);
        }
        DB::commit();
    }
}
