<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kas', function (Blueprint $table) {
            $table->foreignId('iuran_id')
                ->nullable()
                ->after('id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
        });

        $this->replaceManualIuranMutations();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kas', function (Blueprint $table) {
            $table->dropForeign(['iuran_id']);
            $table->dropUnique(['iuran_id']);
            $table->dropColumn('iuran_id');
        });
    }

    /**
     * Iuran mutations are now generated from the iurans table, so setoran rows
     * recorded by hand would double the balance once the observer runs.
     */
    private function replaceManualIuranMutations(): void
    {
        DB::table('kas')
            ->where('kategori', 'iuran')
            ->whereNull('iuran_id')
            ->delete();

        $iurans = DB::table('iurans')
            ->join('users', 'users.id', '=', 'iurans.user_id')
            ->orderBy('iurans.id')
            ->get(['iurans.id', 'iurans.nominal', 'iurans.tanggal_iuran', 'iurans.keterangan', 'users.name']);

        $now = now();

        foreach ($iurans as $iuran) {
            DB::table('kas')->insert([
                'iuran_id' => $iuran->id,
                'jenis' => 'masuk',
                'kategori' => 'iuran',
                'nominal' => $iuran->nominal,
                'tanggal' => $iuran->tanggal_iuran,
                'keterangan' => mb_substr('Iuran '.$iuran->name, 0, 255),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
};
