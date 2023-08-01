<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "external_id",
        "publication_date",
        "title",
        "description",
        "content",
        "link",
        "image",
    ];

    /**
     * Eager loading relations
     *
     * @var array<int, string>
     */
    protected $with = [
        "source",
        "categories",
        "authors"
    ];

    /**
     * Related categories (m-m)
     */
    function categories()
    {
        return $this->belongsToMany(Category::class, "article_category");
    }

    /**
     * Related authors (m-m)
     */
    function authors()
    {
        return $this->belongsToMany(Author::class, "article_author");
    }

    /**
     * Related source (m-o)
     */
    function source()
    {
        return $this->belongsTo(Source::class);
    }
}
