<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("external_id")->unique();
            $table->unsignedBigInteger("source_id");
            $table->foreign("source_id")->references("id")->on("sources")->onDelete("restrict");
            $table->dateTime("publication_date");
            $table->string("title");
            $table->text("description");
            $table->text("content");
            $table->text("link");
            $table->text("image");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
