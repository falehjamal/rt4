<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IuranController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\LaporanKeuanganController;
use App\Http\Controllers\UserController;
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

    Route::get('keuangan/laporan', LaporanKeuanganController::class)
        ->name('keuangan.laporan');

    Route::resource('manajemen/users', UserController::class)
        ->except(['create', 'show', 'edit', 'destroy'])
        ->names('manajemen.users');

    Route::patch('manajemen/users/{user}/status', [UserController::class, 'toggleActive'])
        ->name('manajemen.users.toggle-active');

    Route::get('manajemen/audit', AuditLogController::class)
        ->name('manajemen.audit');
});

require __DIR__.'/settings.php';
