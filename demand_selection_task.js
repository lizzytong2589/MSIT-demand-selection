// generate random ID; 32 char long
var subjectID = jsPsych.randomization.randomID();

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

var check_demand_selection_MSIT_trials = {
    type: 'MSIT-demand-selection',
    is_practice: false,
    n_demand_trials: 5,
    trial_duration: 3000,
    n_repeats: 1,
    on_start: function() {
        console.log("check plugin")
    }
}


//// Demand Selection ////
// set up match/mismatch combinations for demand selection
n_mismatch = [1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,12];
n_match = [5,8,10,13,3,6,8,10,14,2,3,6,9,12,13,15,11,12,16,5,10,9,16,12,14,16,12,16,6,15,10,16,8];
const n_total_demand_choices = n_mismatch.length;
var demand_selection_choices = [];
for (var i = 0; i < n_total_demand_choices; i++) {
    demand_selection_choices.push({matching: n_match[i], mismatching: n_mismatch[i]});
};
shuffled_choices = jsPsych.randomization.shuffle(demand_selection_choices);

// initialize parameters
const n_rounds = 2;
var current_round_num = 1;
const dst_trial_duration = 3000; 
var match_side;
var mismatch_side;
var current_n_matches;
var current_n_mismatches;
var n_trials_MSIT;
var trial_type; // match or mismatch for MSIT trials
var dst_index = 0;
var random_choice;

// array of 0s and 1s to determine side of screen that match/mismatch will be shown on
var left_or_right = new Array(n_total_demand_choices);
left_or_right.fill(0);
left_or_right.fill(1,Math.floor(n_total_demand_choices/2), n_total_demand_choices); // round down start, so 16 0s and 17 1s
left_or_right = jsPsych.randomization.shuffle(left_or_right);

// shuffle again to get a different array for whether or not to run the MSIT trials
show_no_show_MSIT = jsPsych.randomization.shuffle(left_or_right);

// function to make demand selection stimulus
var make_demand_selection = function() {
    var current_choice = shuffled_choices[dst_index];
    current_n_matches = current_choice['matching'];
    current_n_mismatches = current_choice['mismatching'];

    // fixation cross
    var fixation_cross = "<div class = 'col'><div class = 'fixation-trial'>+</div></div>";

    // arrows
    var left_arrow = "<span class = 'arrow-key-container'><</span>";
    var right_arrow = "<span class = 'arrow-key-container'>></span>";
    var arrows = "<div class = 'row'><div class = 'col'>" + left_arrow + 
        "</div><div class = 'col'></div><div class = 'col'>" + right_arrow + "</div></div>";

    
    var demand_trial_html = "";
    demand_trial_html += "<div class = 'dst-container'>";
    demand_trial_html += "<div class = 'row'></div>";
    
    // decide which side of the screen each choice will be on
    if(left_or_right[dst_index] == 0) {
      match_side = 'right';
      mismatch_side = 'left';
      
      // choice on LHS of screen
      demand_trial_html += "<div class = 'row'>";
      demand_trial_html += "<div class ='demand-selection-choice-box col'><p>" + current_n_mismatches + 
        "<span class = 'mismatch'> mismatching</span></p></div>";
      
      demand_trial_html += fixation_cross;

      // choice on RHS of screen
      demand_trial_html += "<div class = 'demand-selection-choice-box col'><p>" + current_n_matches +
        "<span class = 'match'> matching</span></p></div></div>";
      
    } else if(left_or_right[dst_index] == 1){
      match_side = 'left';
      mismatch_side = 'right';

      // choice on LHS of screen
      demand_trial_html += "<div class = 'row'>";
      demand_trial_html += "<div class ='demand-selection-choice-box col'><p>" + current_n_matches +
        "<span class = 'match'> matching</span></p></div>";

      demand_trial_html += fixation_cross;
      
      // choice on RHS of screen
      demand_trial_html += "<div class = 'demand-selection-choice-box col'><p>" + current_n_mismatches +
        "<span class = 'mismatch'> mismatching</span></p></div></div>";

    }

    // add left/right arrows under choices and close div for container
    demand_trial_html += arrows + "</div>";

    return demand_trial_html;
};

// run an individual DST trial
var show_DST = {
    type: "html-keyboard-response",
    stimulus: function() {
        return make_demand_selection();
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
            is_practice: false,
            round: current_round_num,
            key_press: demand_choice,
            is_missed: is_missed,
            match_screen_side: match_side,
            n_matches: current_n_matches,
            mismatch_screen_side: mismatch_side,
            n_mismatches: current_n_mismatches,
            demand_selection_trials_performed: dst_index,
            trial_duration: dst_trial_duration,
        };
          jsPsych.data.write(data);
          // console.table({'round #': current_round_num,'trial idx':dst_index,'trials this round':dst_index, 'choice':demand_choice, 'matches': current_n_matches, 'mismatches': current_n_mismatches, 'show_task':show_no_show_MSIT[dst_index]});
    }
}
 
// call to run MSIT trials
var MSIT_trials = {
    type: 'MSIT',
    n_MSIT_trials: function() {
        return n_trials_MSIT;
    },
    MSIT_trial_duration: 1000,
    MSIT_trial_type: function() {
        return trial_type;
    },
    fixation_duration: 250,
    is_practice: false,
    on_finish: function(data) {
        data.round = current_round_num;
    }
}

// show the MSIT trial type that will be displayed 
var MSIT_trial_choice = {
    type: "html-keyboard-response",
    stimulus: function() {
        if (trial_type == 'matching') {
            return "<p class = 'match' style = 'font-size: 5vmin'>" + trial_type + "</p>";
        } else {
            return "<p class = 'mismatch' style = 'font-size: 5vmin'>" + trial_type + "</p>";
        }
        
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
}

// decide if the round is one where the MSIT trials will be shown
var show_MSIT_conditional = {
    timeline: [MSIT_trial_choice, MSIT_trials],
    conditional_function: function() {
        // determine whether or not to show trials; -1 b/c already incremented # of trials
        return(show_no_show_MSIT[dst_index] == 1);
    }
}

// if MSIT trials not shown, show a message
var no_show_MSIT = {
    type: "html-keyboard-response",
    stimulus: "<p style = 'font-size: 5vmin; font-weight: 'bold>Trials omitted.</p>",
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
}

// another conditional for state when no MSIT trials run
var no_show_MSIT_conditional = {
    timeline: [no_show_MSIT],
    conditional_function: function() {
        return(show_no_show_MSIT[dst_index] == 0);
    }
}

// go through distinct demand selection trials (repeat set # of times) w/ possibility of running MSIT trials...
var DST_trials = {
    timeline: [show_DST, show_MSIT_conditional, no_show_MSIT_conditional],
    loop_function: function() {
        return (dst_index < n_total_demand_choices);
    },
}

// text to display in between rounds
var next_round = {
    type: "html-keyboard-response",
    stimulus: function() {
        if (current_round_num != n_rounds) {
            var string = "<p style = 'font-size: 120%'>You have completed "+ current_round_num + " round(s) of " + n_rounds + "." +
            "<br>When you are ready, please press the space bar to continue to the next round.</br></p>";
            
        } else if (current_round_num == n_rounds){
            var string = "<p style = 'font-size: 120%'>You have completed " + current_round_num + " round(s) of " + n_rounds + "."+
            "<br>Thank you for participating in this experiment. You may now close this page.</br></p>";
        }
        return string;
    },
    choices: ['space'],
    on_finish: function() {
        
        // increment round #
        current_round_num++;

        // reshuffle arrays and reset counters 
        dst_index = 0;
        shuffled_choices = jsPsych.randomization.shuffle(shuffled_choices);
        left_or_right = jsPsych.randomization.shuffle(left_or_right);
        show_no_show_MSIT = jsPsych.randomization.shuffle(show_no_show_MSIT);
    }
}

// carry out dst for a set # of rounds
var rounds = {
    timeline:[DST_trials, next_round],
    loop_function: function(){
        return (current_round_num <= n_rounds);
    },
}

//  set up experiment structure
var main_timeline = [];
main_timeline.push(welcome);
main_timeline.push(check_demand_selection_MSIT_trials);
main_timeline.push(...instructions);
main_timeline.push(rounds);


// images for preloading
var instruction_images = MSIT_pagelinks_a.concat(MSIT_pagelinks_b);

// start experiment
jsPsych.init({
    timeline: main_timeline,
    exclusions: {
        min_width: 500,
        min_height: 265,
      },
    preload_images: instruction_images,
    // on_close: function() {
        // // add subject ID to data
        // jsPsych.data.get().addToAll({subject_ID: subjectID});

        // var interaction_data = jsPsych.data.getInteractionData();

        // // filter data by experiment phase
        // var MSIT_dst_data = jsPsych.data.get().filterCustom(function(trial){
        //     return ((trial.phase =='MSIT') || (trial.phase =='demand selection'));
        // });
        // MSIT_dst_data = MSIT_dst_data.ignore('internal_node_id');
        // MSIT_dst_data = MSIT_dst_data.ignore('trial_type');

        // var results = MSIT_dst_data.join(interaction_data);
       
        // var file_name = date + '_' + time + '_incomplete_results.csv';
        // results.localSave('csv', file_name);
    // },
    on_finish: function() {
        // add subject ID to data
        jsPsych.data.get().addToAll({subject_ID: subjectID});
        var interaction_data = jsPsych.data.getInteractionData();

        // filter data by experiment phase
        var MSIT_dst_data = jsPsych.data.get().filterCustom(function(trial){
            return ((trial.phase =='MSIT') || (trial.phase =='demand selection'));
        });
        MSIT_dst_data = MSIT_dst_data.ignore('internal_node_id');
        MSIT_dst_data = MSIT_dst_data.ignore('trial_type');

        var results = MSIT_dst_data.join(interaction_data);
       
        var file_name = date + '_' + time + '_results.csv';
        results.localSave('csv', file_name);

    },
});