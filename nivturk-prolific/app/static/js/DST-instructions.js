var DST_pagelinks_a = ['../static/Instructions/instructions_DST/Slide01.png',
                            '../static/Instructions/instructions_DST/Slide02.png',
                            '../static/Instructions/instructions_DST/Slide03.png',
                            '../static/Instructions/instructions_DST/Slide04.png',
                            '../static/Instructions/instructions_DST/Slide05.png',
                            '../static/Instructions/instructions_DST/Slide06.png',
                            '../static/Instructions/instructions_DST/Slide07.png',
                            '../static/Instructions/instructions_DST/Slide08.png',
                            '../static/Instructions/instructions_DST/Slide09.png',
                            '../static/Instructions/instructions_DST/Slide10.png',
                            '../static/Instructions/instructions_DST/Slide11.png',
                            '../static/Instructions/instructions_DST/Slide12.png',
                            '../static/Instructions/instructions_DST/Slide13.png',
                            '../static/Instructions/instructions_DST/Slide14.png',
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

var practice_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    choices: ['space'],
    prompt: function() {
        return "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out the "+
            "Batch Choice Game! </span></br> Please press space to start.</p>";
    },

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
const dst_trial_duration = 3000;  // amount of time to make DST choice
var match_side;
var mismatch_side;
var current_n_matches;
var current_n_mismatches;
var n_choice_fewer; // whether # trials chosen is less than the option not chosen
var n_choice_diff;
var demand_choice;
var n_trials_MSIT;
var trial_type; // match or mismatch for MSIT trials
var dst_index = 0;
var random_choice;
var default_side;
var is_practice = true;
var current_round = 0;

// run an individual DST trial
var show_DST = {
    type: "html-keyboard-response",
    stimulus: function() {
        match_or_mismatch_first = Math.random();
        return make_dst_stimulus();
    },
    trial_duration: dst_trial_duration,
    choices: ['leftarrow', 'rightarrow'],
    on_finish: function(data) {
        demand_choice = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
        is_missed = (data.key_press == null);
        n_choice_fewer = false;
        if(is_missed) {
            demand_choice = null;
            random_choice = Math.random();
            if (random_choice <= 0.5) {
                default_side = 'left';
            } else {
                default_side = 'right';
            }
        }

        // possibilities for MSIT based on dst response (or lack thereof)
        if((demand_choice == 'leftarrow' && match_side == 'left') || (demand_choice == 'rightarrow' && match_side == 'right') ||
        (default_side == 'left' && match_side == 'left') || (default_side == 'right' && match_side == 'right')) {
            n_trials_MSIT = current_n_matches;
            trial_type = 'matching';
            
            // check if need delay screen
            if(current_n_matches < current_n_mismatches) {
                n_choice_fewer = true;
                n_choice_diff = current_n_mismatches - current_n_matches;
            }

        } else if ((demand_choice == 'leftarrow' && mismatch_side == 'left') || (demand_choice == 'rightarrow' && mismatch_side == 'right') ||
        ((default_side == 'left' && mismatch_side == 'left') || (default_side == 'right' && mismatch_side == 'right'))) {
            n_trials_MSIT = current_n_mismatches;
            trial_type = 'mismatching';

            if(current_n_mismatches < current_n_matches) {
                n_choice_fewer = true;
                n_choice_diff = current_n_matches - current_n_mismatches;
            }
        } 

        // data writing
        data.phase ='demand selection';
        data.is_practice= is_practice;
        data.round = current_round;
        data.key_press = demand_choice;
        data.button_pressed = "ignore";
        data.is_missed = is_missed;
        data.match_screen_side = match_side;
        data.n_matching = current_n_matches;
        data.mismatch_screen_side = mismatch_side;
        data.n_mismatching = current_n_mismatches;
        data.demand_selection_trials_performed = dst_index + 1;
        data.trial_duration = dst_trial_duration;
        data.message_duration = message_duration;
        data.fixation_duration = fixation_duration;
        data.experiment_time = jsPsych.totalTime();
        
        //   console.table({'round #': current_round,'trial idx':dst_index,'trials this round':dst_index, 'choice':demand_choice, 'matches': current_n_matches, 'mismatches': current_n_mismatches, 'show_task':show_no_show_MSIT[dst_index]});
    }
}

var DST_choice = {
    type: 'html-keyboard-response',
    stimulus: function() {
        return make_dst_stimulus();
    },
    trial_duration: message_duration,
    choices: jsPsych.NO_KEYS,
    on_finish: function(data) {
        data.phase = 'ignore';
        // increment # of trials performed
        dst_index++;

        // reset for next trials
        demand_choice = null;
        default_side = null;
        is_missed == null;
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
    MSIT_trial_duration: MSIT_trial_duration,
    MSIT_trial_type: function() {
        return trial_type;
    },
    fixation_duration: fixation_duration,
    is_practice: function() {
        return is_practice;
    },
}

// delay if # of trials chosen is fewer than # of trials in option not chosen
var delay_screen = {
    type: 'html-keyboard-response',
    stimulus: function(){
        if(n_choice_fewer) {
            return "<p style = 'font-size: 7vmin; font-weight: 'bold>...</p>";
        } else {
            return "";
        }
    },
    trial_duration: function() {
        if(n_choice_fewer) {
            var delay_time = (n_choice_diff/2.0) * (fixation_duration + MSIT_trial_duration);
            return delay_time;
        } else {
            return 0;
        }
    },
    choices: jsPsych.NO_KEYS,
}

// decide if the round is one where the MSIT trials will be shown
var show_MSIT_conditional = {
    timeline: [delay_screen, MSIT_trials, delay_screen],
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
    timeline: [show_DST, DST_choice, show_MSIT_conditional, no_show_MSIT_conditional],
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
        // set up for actual trials; reset/re-write parameters
        dst_index = 0;
        is_practice = false;
        current_round++;

        n_demand_trials = n_total_demand_choices;
        shuffled_choices = jsPsych.randomization.sampleWithoutReplacement(demand_selection_choices, n_demand_trials);

        // array of 0s and 1s to determine side of screen that match/mismatch will be shown on (re-write arrays used in instructions)
        // end up with one more 1 than 0s
        left_or_right = [];
        for(var i = 0; i < 4; i++) {
            var temp = new Array(Math.floor(n_demand_trials/4));
            temp.fill(0);
            temp.fill(1, Math.floor(temp.length/2), temp.length);
            temp = jsPsych.randomization.shuffle(temp);
            left_or_right.push(...temp);
        }
        var extra = new Array(Math.floor(n_demand_trials%4));
        extra.fill(0);
        extra.fill(1, Math.floor(extra.length/2), extra.length);
        extra = jsPsych.randomization.shuffle(extra);
        left_or_right.push(...extra);

        // shuffle again to get a different array for whether or not to run the MSIT trials
        show_no_show_MSIT = jsPsych.randomization.shuffle(left_or_right);
    }
}

var instructions_DST = [];
instructions_DST.push(instructions_DST_a);
instructions_DST.push(practice_intro);
instructions_DST.push(...practice_DST);
instructions_DST.push(end_instructions);
