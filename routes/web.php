<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IuranController;
use App\Http\Controllers\KasController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'dashboard' : 'login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('keuangan/iuran', IuranController::class)
        ->except(['create', 'show', 'edit'])
        ->names('keuangan.iuran');

    Route::resource('keuangan/kas', KasController::class)
        ->except(['create', 'show', 'edit'])
        ->parameters(['kas' => 'kas'])
        ->names('keuangan.kas');
});

require __DIR__.'/settings.php';
