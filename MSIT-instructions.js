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
const fixation_duration = 250;
const message_duration = 1000;

// CONGRUENT(matching) INTRO
var matching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight: bold'>Let's try out some " +
        "<span class ='match'>matching</span> trials! </span><br> Press any key to start.</p>"
}

// match trials
var current_correct_key = 0;
var match_trials = {
    type: 'MSIT',
    round: 0,
    n_MSIT_trials: 4,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'matching',
    fixation_duration: 250,
    message_duration: 750,
    is_practice: true,
}

// INCONGRUENT(mismatching) INTRO
var mismatching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out some "+
        "<span style ='color:orange'>mismatching</span> trials! </span></br> Press any key to start.</p>"
}

// mismatch trials
var mismatch_trials = {
    type: 'MSIT',
    round: 0,
    n_MSIT_trials: 4,
    MSIT_trial_duration: 1000,
    MSIT_trial_type: 'mismatching',
    fixation_duration: 250,
    message_duration: 750,
    is_practice: false,
}

var instructions_MSIT = [];
instructions_MSIT.push(instructions_MSIT_a);
instructions_MSIT.push(matching_intro);
instructions_MSIT.push(match_trials);
instructions_MSIT.push(instructions_MSIT_b);
instructions_MSIT.push(mismatching_intro);
instructions_MSIT.push(mismatch_trials);