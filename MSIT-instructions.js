var MSIT_pagelinks_a = ['Instructions/instructions_MSIT/Slide01.png',
                            'Instructions/instructions_MSIT/Slide02.png',
                            'Instructions/instructions_MSIT/Slide03.png',
                            'Instructions/instructions_MSIT/Slide04.png',
                            'Instructions/instructions_MSIT/Slide05.png',
                            'Instructions/instructions_MSIT/Slide06.png',
                            'Instructions/instructions_MSIT/Slide07.png',
                            'Instructions/instructions_MSIT/Slide08.png',
                            'Instructions/instructions_MSIT/Slide09.png',
                            'Instructions/instructions_MSIT/Slide10.png',
                            'Instructions/instructions_MSIT/Slide11.png',
                            'Instructions/instructions_MSIT/Slide12.png',
                            'Instructions/instructions_MSIT/Slide13.png',
                            'Instructions/instructions_MSIT/Slide14.png',
                            'Instructions/instructions_MSIT/Slide15.png',
                            'Instructions/instructions_MSIT/Slide16.png',
                            'Instructions/instructions_MSIT/Slide17.png',
                            'Instructions/instructions_MSIT/Slide18.png',
                            'Instructions/instructions_MSIT/Slide19.png',
                            'Instructions/instructions_MSIT/Slide20.png',
                            'Instructions/instructions_MSIT/Slide21.png',
                            'Instructions/instructions_MSIT/Slide22.png',
];

var MSIT_pagelinks_b = ['Instructions/instructions_MSIT/Slide23.png',
                            'Instructions/instructions_MSIT/Slide24.png',
                            'Instructions/instructions_MSIT/Slide25.png', 
                            'Instructions/instructions_MSIT/Slide26.png',
                            'Instructions/instructions_MSIT/Slide27.png',
                            'Instructions/instructions_MSIT/Slide28.png',
                            'Instructions/instructions_MSIT/Slide29.png',
                            'Instructions/instructions_MSIT/Slide30.png',
                            'Instructions/instructions_MSIT/Slide31.png', 
                            'Instructions/instructions_MSIT/Slide32.png', 
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

var instructions_MSIT_a = {
    type: 'instructions',
    pages: MSIT_pages_a,
    show_clickable_nav: true
}

var instructions_MSIT_b = {
    type: 'instructions',
    pages: MSIT_pages_b,
    show_clickable_nav: true
}

//////// PRACTICE MSIT TRIALS ////////
const n_practice_MSIT = 4; // keep number trials same for practice matching and mismatching

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
        "<span class ='match'>matching</span> trials! </span><br> Press any key to start.</p>"
}

// match trials
var match_trials_performed = 0;
var correct = false;
var current_correct_key = 0;
var match_trial = {
    type: 'MSIT',
    round: 0,
    n_MSIT_trials: 1,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'matching',
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
      return (match_trials_performed < n_practice_MSIT) 
    }
}

// INCONGRUENT(mismatching) INTRO
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
    round: 0,
    n_MSIT_trials: 1,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'mismatching',
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
      return (mismatch_trials_performed < n_practice_MSIT) 
    }
}

var instructions_MSIT = [];
instructions_MSIT.push(instructions_MSIT_a);
instructions_MSIT.push(matching_intro);
instructions_MSIT.push(loop_match);
instructions_MSIT.push(instructions_MSIT_b);
instructions_MSIT.push(mismatching_intro);
instructions_MSIT.push(loop_mismatch);