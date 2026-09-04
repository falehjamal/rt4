<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IuranController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'dashboard' : 'login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('keuangan/iuran', IuranController::class)
        ->except(['create', 'show', 'edit'])
        ->names('keuangan.iuran');
});

require __DIR__.'/settings.php';
