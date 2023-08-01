<?php

namespace Database\Seeders\Feeders;

class Helpers {
  static function parseAuthorsFromByline($byline = "") {
    $authors = preg_split("/(,)|(and)/i", $byline);
    $authors = array_map(fn($v) => preg_replace("/^By/", "", $v), $authors);
    $authors = array_map(fn($v) => trim(preg_replace("/\(.*?\)/", "", $v)), $authors);
    return array_filter($authors);
  }
}