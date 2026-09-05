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
        Schema::create('kas', function (Blueprint $table) {
            $table->id();
            $table->string('jenis');
            $table->string('kategori');
            $table->decimal('nominal', 15, 2);
            $table->date('tanggal');
            $table->string('keterangan')->nullable();
            $table->string('bukti')->nullable();
            $table->timestamps();

            $table->index(['tanggal', 'jenis']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kas');
    }
};
