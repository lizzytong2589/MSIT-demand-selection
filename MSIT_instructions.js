var MSIT_pagelinks_a = ['Stimuli/MSIT_instructions/Slide1.png',
                                'Stimuli/MSIT_instructions/Slide2.png',
                                'Stimuli/MSIT_instructions/Slide3.png',
                                'Stimuli/MSIT_instructions/Slide4.png',
                                'Stimuli/MSIT_instructions/Slide5.png',
                                'Stimuli/MSIT_instructions/Slide6.png',
                                'Stimuli/MSIT_instructions/Slide7.png',
                                'Stimuli/MSIT_instructions/Slide8.png',
                                'Stimuli/MSIT_instructions/Slide9.png',
                                'Stimuli/MSIT_instructions/Slide10.png',
                                'Stimuli/MSIT_instructions/Slide11.png',
                                'Stimuli/MSIT_instructions/Slide12.png',
                                'Stimuli/MSIT_instructions/Slide13.png',
                                'Stimuli/MSIT_instructions/Slide14.png',
                                'Stimuli/MSIT_instructions/Slide15.png',
                                'Stimuli/MSIT_instructions/Slide16.png',
                                'Stimuli/MSIT_instructions/Slide17.png',
                                'Stimuli/MSIT_instructions/Slide18.png',
                                'Stimuli/MSIT_instructions/Slide19.png',
];

var MSIT_pagelinks_b = ['Stimuli/MSIT_instructions/Slide20.png',
                                'Stimuli/MSIT_instructions/Slide21.png',
                                'Stimuli/MSIT_instructions/Slide22.png',
                                'Stimuli/MSIT_instructions/Slide23.png',
                                'Stimuli/MSIT_instructions/Slide24.png', 
                                'Stimuli/MSIT_instructions/Slide25.png',
                                'Stimuli/MSIT_instructions/Slide26.png',
                                'Stimuli/MSIT_instructions/Slide27.png',
                                'Stimuli/MSIT_instructions/Slide28.png',
                                'Stimuli/MSIT_instructions/Slide29.png',
                                'Stimuli/MSIT_instructions/Slide30.png', 
];


// Set up pages for instructions
var MSIT_pages_a = [];
for (var i = 0; i < MSIT_pagelinks_a.length; i++){
    MSIT_pages_a.push('<img src= "'+ MSIT_pagelinks_a[i] +  '" alt = "" >')
}

var MSIT_pages_b = [];
for (var i = 0; i < MSIT_pagelinks_b.length; i++){
    MSIT_pages_b.push('<img src= "'+ MSIT_pagelinks_b[i] +  '" alt = "" >')
}

var MSIT_instructions_a = {
    type: 'instructions',
    pages: MSIT_pages_a,
    show_clickable_nav: true
}

var MSIT_instructions_b = {
    type: 'instructions',
    pages: MSIT_pages_b,
    show_clickable_nav: true
}


//////// PRACTICE MSIT TRIALS ////////
const n_practice = 4; // keep number trials same for practice matching and mismatching

// feedback for practice trials; triggers only when incorrect response
var feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    response_ends_trial: false,
    choice: jsPsych.NO_KEYS,
    trial_duration: 750,
    on_start: function(trial) {
        var practice_MSIT_data = jsPsych.data.get().last(2).values()[0];
        // console.log(practice_MSIT_data);
        current_correct_key = practice_MSIT_data['correct_response'];
        var current_key_pressed = practice_MSIT_data['key_press'];
        if (current_correct_key != current_key_pressed) {
            incorr_str = "<p style = 'font-size: 200%; line-height: 150%'>Incorrect. Oddball was <br>" +
                "<span style = 'font-weight:bold; font-size: 175%'>" + current_correct_key + "</span></p>";
            trial.stimulus = incorr_str;
        } else {
            this.trial_duration = 0;
        }
    },
}

// CONGRUENT(matching) INTRO
var matching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight: bold'>Let's try out some " +
        "<span style ='color:blue'>matching</span> trials! </span><br> Press any key to start.</p>"
}

// match trials
var match_trials_performed = 0;
var correct = false;
var current_correct_key = 0;
var match_trial = {
    type: 'MSIT',
    n_MSIT_trials: 1,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'match',
    fixation_duration: 250,
    is_practice: true,
    on_finish: function(data) {
        match_trials_performed++;
        data.MSIT_trials_performed = match_trials_performed; 
    }
}

// run through practice match trials
var practice_match = [match_trial, feedback];
var loop_match = {
    timeline: practice_match,
    loop_function: function() {
      return (match_trials_performed < n_practice) 
    }
}

// INCONGRUENT(mistmatching) INTRO
var mismatching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out some "+
        "<span style ='color:orange'>mismatching</span> trials! </span></br> Press any key to start.</p>"
}

// mismatch trials
var mismatch_trials_performed = 0;
var mismatch_trial = {
    type: 'MSIT',
    n_MSIT_trials: 1,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'mismatch',
    fixation_duration: 250,
    is_practice: true,
    on_finish: function(data) {
        mismatch_trials_performed++;
        data.MSIT_trials_performed = mismatch_trials_performed;
    }
}

// run through practice mismatch trials
var practice_mismatch = [mismatch_trial, feedback];
var loop_mismatch = {
    timeline: practice_mismatch,
    loop_function: function() {
      return (mismatch_trials_performed < n_practice) 
    }
}

var end_instructions = {
    type: 'html-keyboard-response',
    stimulus: "<p><span style = 'font-size:200%'>Great job! You're ready to start the experiment!</span>" +
    " </br>Press any key to continue.</p>",
}

var instructions = [];
instructions.push(MSIT_instructions_a);
instructions.push(matching_intro);
instructions.push(loop_match);
instructions.push(MSIT_instructions_b);
instructions.push(mismatching_intro);
instructions.push(loop_mismatch);
instructions.push(end_instructions);
