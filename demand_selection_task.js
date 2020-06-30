// Popup for user to input ID
'use strict';
let ID = prompt("What is your worker ID?", "");  

// generate random ID if none input
if (ID == null || ID == "") {
    ID = jsPsych.randomization.randomID(10);
}

// start time for file naming
var date = '';
var time = '';

// welcome and enable fullscreen mode
var welcome = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: '<p><span style = "font-weight:bold;font-size:200%">Welcome!</span> <br> The experiment will switch to ' +
        'fullscreen mode when you press the button below.</p>',
    on_start: function(){
        var start_time = jsPsych.startTime()
        var today = start_time.toDateString();
        date = today.substring(8,10) + '-' +  today.substring(4,7) + '-' + today.substring(11,15); // DD-MMM-YYYY
        time = time + start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
    }
}

//// Demand Selection ////
const n_rounds = 2;

// text to display in between rounds
var next_round = {
    type: 'html-button-response',
    stimulus: function() {
        if (current_round != n_rounds) {
            var string = "<p style = 'font-size: 120%'>You have completed "+ current_round + " round(s) of " + n_rounds + "." +
            "<br>When you are ready, please press the button below to continue to the next round.</br></p>";
            
        } else {
            var string = "<p style = 'font-size: 120%'>You have completed " + current_round + " round(s) of " + n_rounds + "."+
            "<br>Thank you for participating in this experiment. You may now close this page.</br></p>";
        }
        return string;
    },
    choices: ['Continue'],
    on_finish: function() {
        // increment round #
        current_round++;

        // shuffle arrays and reset counters for the round
        dst_index = 0;
        shuffled_choices = jsPsych.randomization.shuffle(shuffled_choices);
        left_or_right = jsPsych.randomization.shuffle(left_or_right);
        show_no_show_MSIT = jsPsych.randomization.shuffle(show_no_show_MSIT);
    }
}

// carry out dst for a set # of rounds
var rounds = {
    timeline: [DST_trials, next_round],
    loop_function: function(){
        return (current_round <= n_rounds);
    },
}

//  set up experiment structure
var main_timeline = [];
main_timeline.push(welcome);
main_timeline.push(...instructions_MSIT);
main_timeline.push(...instructions_DST);
main_timeline.push(rounds);

// images for preloading
var instruction_images = MSIT_pagelinks_a.concat(MSIT_pagelinks_b);
instruction_images.concat(DST_pagelinks_a);

// start experiment
jsPsych.init({
    timeline: main_timeline,
    exclusions: {
        min_width: 500,
        min_height: 265,
      },
    preload_images: instruction_images,
    on_finish: function() {
        // add subject ID to data
        jsPsych.data.get().addToAll({worker_ID: name});
        var interaction_data = jsPsych.data.getInteractionData();

        // filter data by experiment phase
        var MSIT_dst_data = jsPsych.data.get().filterCustom(function(trial){
            return ((trial.phase =='MSIT') || (trial.phase =='demand selection'));
        });
        MSIT_dst_data = MSIT_dst_data.ignore('internal_node_id');
        MSIT_dst_data = MSIT_dst_data.ignore('trial_type');
        MSIT_dst_data = MSIT_dst_data.ignore('trial_index');

        var results = MSIT_dst_data.join(interaction_data);
       
        var file_name = 'ID:' + ID + '_'+ date + '_' + time + '_results.csv';

        results.localSave('csv', file_name);

    },
});