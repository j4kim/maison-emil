<?php

namespace Database\Seeders;

use App\Models\Window;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class WindowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i < 25; $i++) {
            Window::create(['opens_on' => Carbon::create(2026, 12, $i)]);
        }
    }
}
