<?php

return [
  "new_york_times" => [
    "api_key" => env("NEW_YORK_TIMES_IO_API_KEY")
  ],
  "the_guardian" => [
    "api_key" => env("THE_GUARDIAN_IO_API_KEY")
  ],
  "newsdata_io" => [
    "api_key" => env("NEWSDATA_IO_API_KEY"),
    "source_map" => [
      "buzzfeed" => "BuzzFeed",
      "sciencenews" => "Science News",
      "nbcnews" => "NBC News", 
      "telegraph" => "The Telegraph", 
      "cbsnews" => "CBS News",
    ]
  ]
];