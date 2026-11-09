<?php

namespace App\Console\Commands;

use App\Models\Window;
use Carbon\Carbon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:shift-open-dates')]
#[Description('Shift opens_on for all windows for testing purpose')]
class ShiftOpenDates extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $months = intval($this->ask('Months to add', -1));
        foreach (Window::all() as $window) {
            $window->opens_on = Carbon::create($window->opens_on)->addMonths($months);
            $window->save();
        }
    }
}
