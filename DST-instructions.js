var DST_pagelinks_a = ['Instructions/instructions_DST/Slide1.png',
                                'Instructions/instructions_DST/Slide2.png',
                                'Instructions/instructions_DST/Slide3.png',
                                'Instructions/instructions_DST/Slide4.png',
                                'Instructions/instructions_DST/Slide5.png',
                                'Instructions/instructions_DST/Slide6.png',
                                'Instructions/instructions_DST/Slide7.png',
                                'Instructions/instructions_DST/Slide8.png',
                                'Instructions/instructions_DST/Slide9.png',
];

// Set up pages for instructions
var DST_pages_a = [];
for (var i = 0; i < DST_pagelinks_a.length; i++){
    DST_pages_a.push('<img src= "'+ DST_pagelinks_a[i] +  '" alt = "" >')
}

var instructions_DST_a = {
    type: 'instructions',
    pages: DST_pages_a,
    show_clickable_nav: true
}

// set up match/mismatch combinations for demand selection (also use these arrays in the actual dst)
var n_mismatch = [1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,12];
var n_match = [5,8,10,13,3,6,8,10,14,2,3,6,9,12,13,15,11,12,16,5,10,9,16,12,14,16,12,16,6,15,10,16,8];
const n_total_demand_choices = n_mismatch.length;
var demand_selection_choices = [];
for (var i = 0; i < n_total_demand_choices; i++) {
    demand_selection_choices.push({matching: n_match[i], mismatching: n_mismatch[i]});
};

const n_practice_DST = 4;
var n_demand_trials = n_practice_DST;

var shuffled_choices = jsPsych.randomization.sampleWithoutReplacement(demand_selection_choices, n_demand_trials);

// array of 0s and 1s to determine side of screen that match/mismatch will be shown on
var left_or_right = new Array(n_demand_trials);
left_or_right.fill(0);
left_or_right.fill(1,Math.floor(n_demand_trials/2), n_demand_trials); // round down start, one more 1 than 0s
left_or_right = jsPsych.randomization.shuffle(left_or_right);

// shuffle again to get a different array for whether or not to run the MSIT trials
var show_no_show_MSIT = jsPsych.randomization.shuffle(left_or_right);

//////// PRACTICE DST TRIALS ////////
// initialize parameters (same ones used in demand_selection_task)
const dst_trial_duration = 7000; 
var match_side;
var mismatch_side;
var current_n_matches;
var current_n_mismatches;
var n_trials_MSIT;
var trial_type; // match or mismatch for MSIT trials
var dst_index = 0;
var random_choice;
var is_practice = true;
var current_round = 0;
var message_duration = 500;

// run an individual DST trial
var show_DST = {
    type: "html-keyboard-response",
    stimulus: function() {
        return make_dst_stimulus();
    },
    trial_duration: dst_trial_duration,
    choices: ['leftarrow', 'rightarrow'],
    on_finish: function(data) {
        var demand_choice = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
        is_missed = (data.key_press == null);
        if(is_missed) {
            demand_choice = null;
            random_choice = Math.random();
        }
        // possibilities for MSIT based on dst response (or lack thereof)
        if((demand_choice == 'leftarrow' && match_side == 'left') || (demand_choice == 'rightarrow' && match_side == 'right') ||
        (is_missed && random_choice <= 0.5)) {
            n_trials_MSIT = current_n_matches;
            trial_type = 'matching';
        } else if ((demand_choice == 'leftarrow' && mismatch_side == 'left') || (demand_choice == 'rightarrow' && mismatch_side == 'right') ||
        ((is_missed && random_choice > 0.5))) {
            n_trials_MSIT = current_n_mismatches;
            trial_type = 'mismatching';
        } 

        // increment # of trials performed
        dst_index++;

        // data writing
        var data = {
            phase: 'demand selection',
            is_practice: is_practice,
            round: current_round,
            key_press: demand_choice,
            is_missed: is_missed,
            match_screen_side: match_side,
            n_matches: current_n_matches,
            mismatch_screen_side: mismatch_side,
            n_mismatches: current_n_mismatches,
            demand_selection_trials_performed: dst_index,
            trial_duration: dst_trial_duration,
            message_duration: message_duration,
        };
          jsPsych.data.write(data);
          // console.table({'round #': current_round,'trial idx':dst_index,'trials this round':dst_index, 'choice':demand_choice, 'matches': current_n_matches, 'mismatches': current_n_mismatches, 'show_task':show_no_show_MSIT[dst_index]});
    }
}
 
// call to run MSIT trials
var MSIT_trials = {
    type: 'MSIT',
    round: function() {
        return current_round;
    },
    n_MSIT_trials: function() {
        return n_trials_MSIT;
    },
    MSIT_trial_duration: 1000,
    MSIT_trial_type: function() {
        return trial_type;
    },
    fixation_duration: 250,
    is_practice: function() {
        return is_practice;
    },
}

// show the MSIT trial type that will be displayed 
var MSIT_trial_choice = {
    type: "html-keyboard-response",
    stimulus: function() {
        if (trial_type == 'matching') {
            return "<p class = 'match' style = 'font-size: 7vmin'>" + trial_type + "</p>";
        } else {
            return "<p class = 'mismatch' style = 'font-size: 7vmin'>" + trial_type + "</p>";
        }
        
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: message_duration,
}

// decide if the round is one where the MSIT trials will be shown
var show_MSIT_conditional = {
    timeline: [MSIT_trial_choice, MSIT_trials],
    conditional_function: function() {
        // determine whether or not to show trials; -1 b/c already incremented # of trials
        return(show_no_show_MSIT[dst_index - 1] == 1);
    }
}

// if MSIT trials not shown, show a message
var no_show_MSIT = {
    type: "html-keyboard-response",
    stimulus: "<p style = 'font-size: 7vmin; font-weight: 'bold>Trials omitted...</p>",
    choices: jsPsych.NO_KEYS,
    trial_duration: message_duration,
}

// another conditional for state when no MSIT trials run
var no_show_MSIT_conditional = {
    timeline: [no_show_MSIT],
    conditional_function: function() {
        return(show_no_show_MSIT[dst_index - 1] == 0);
    }
}

// go through distinct demand selection trials (repeat set # of times) w/ possibility of running MSIT trials...
var DST_trials = {
    timeline: [show_DST, show_MSIT_conditional, no_show_MSIT_conditional],
    loop_function: function() {
        return (dst_index < n_demand_trials);
    },
}

var practice_DST = [DST_trials];

var end_instructions = {
    type: 'html-button-response',
    stimulus: "<p><span style = 'font-size:200%'>Great job! You're ready to start the experiment!</span>" +
    " </br>Please click the button below to begin.</p>",
    choices: ['Start'],
    on_start: function() {
        // set up for actual trials
        dst_index = 0;
        is_practice = false;
        current_round = 1;

        n_demand_trials = n_total_demand_choices;
        shuffled_choices = jsPsych.randomization.sampleWithoutReplacement(demand_selection_choices, n_demand_trials);

        // array of 0s and 1s to determine side of screen that match/mismatch will be shown on (re-write arrays used in instructions)
        left_or_right = new Array(n_demand_trials);
        left_or_right.fill(0);
        left_or_right.fill(1,Math.floor(n_demand_trials/2), n_demand_trials); // round down start, one more 1 than 0s
        left_or_right = jsPsych.randomization.shuffle(left_or_right);

        // shuffle again to get a different array for whether or not to run the MSIT trials
        show_no_show_MSIT = jsPsych.randomization.shuffle(left_or_right);
    }
}

var instructions_DST = [];
instructions_DST.push(instructions_DST_a);
instructions_DST.push(...practice_DST);
instructions_DST.push(end_instructions);
