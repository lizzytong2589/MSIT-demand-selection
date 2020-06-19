// start time for file naming
var date = '';
var time = '';

// welcome and enable fullscreen mode
var welcome = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: '<p><span style = "font-weight:bold;font-size:200%">Welcome!</span> <br> The experiment will switch to fullscreen mode when you press the button below.</p>',
    on_start: function(){
        var start_time = jsPsych.startTime()
        var today = start_time.toDateString();
        date = today.substring(8,10) + '-' +  today.substring(4,7) + '-' + today.substring(11,15); // DD-MMM-YYYY
        time = time + start_time.getHours() + start_time.getMinutes() + start_time.getSeconds();
    }
};

// change trials to trials
var MSIT_trials = {
    type: 'MSIT',
    n_MSIT_trials: 6,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'congruent',
    fixation_duration: 250,
    is_practice: false,
    demand_selection: false,
}

var temp_intermediate = {
    type: 'html-keyboard-response',
    stimulus: 'demand selection next'
}

var demand_selection_MSIT_trials = {
    type: 'MSIT',
    n_MSIT_trials: 6,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: null,
    fixation_duration: 250,
    is_practice: false,
    demand_selection: true,
}

//  set up experiment structure
var timeline = [];
timeline.push(welcome);
timeline.push(...instructions)
timeline.push(MSIT_trials);
timeline.push(temp_intermediate);
timeline.push(demand_selection_MSIT_trials);
timeline.push(temp_intermediate);
timeline.push(demand_selection_MSIT_trials);

var instruction_images = MSIT_pagelinks_a;

// start experiment
jsPsych.init({
    timeline: timeline,
    preload_images: instruction_images,
    on_close: function() {
        // jsPsych.data.get().localSave('csv','partial_results.csv');
        // var file_name = date + '_' + time + '_partial_results.csv';
        // jsPsych.data.get().localSave('csv', file_name);
    },
    on_finish: function() {
        var MSIT_data = jsPsych.data.get().filter({phase: 'MSIT'});
        // jsPsych.data.get().filter({phase: 'foraging'}).localSave('csv','foraging_results.csv');

        var file_name = date + '_' + time + '_results.csv';
        MSIT_data.localSave('csv', file_name);
    },
});
