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
];

var MSIT_pagelinks_b = ['Instructions/instructions_MSIT/Slide20.png',
                            'Instructions/instructions_MSIT/Slide21.png',
                            'Instructions/instructions_MSIT/Slide22.png',
                            'Instructions/instructions_MSIT/Slide23.png',
                            'Instructions/instructions_MSIT/Slide24.png',
                            'Instructions/instructions_MSIT/Slide25.png', 
                            'Instructions/instructions_MSIT/Slide26.png',
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
const MSIT_trial_duration = 1000;
var practice_MSIT_trial_types = ['matching', 'mismatching'];
var practice_type_count = 0;

// Practie trials intro screen
var practice_MSIT_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: function() {
        if(practice_MSIT_trial_types[practice_type_count] == 'matching') {
            return "<p><span style = 'font-size: 200%; font-weight: bold'>Let's try out some " +
            "<span class ='match'>matching</span> trials! </span><br> Press any key to start.</p>";
        } else {
            return "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out some "+
            "<span class ='mismatch'>mismatching</span> trials! </span></br> Press any key to start.</p>"
        }
    },
}

var practice_MSIT_trials = {
    type: 'MSIT',
    round: 0,
    n_MSIT_trials: 4,
    MSIT_trial_duration: MSIT_trial_duration,
    MSIT_trial_type: function() {
        return practice_MSIT_trial_types[practice_type_count];
    },
    fixation_duration: fixation_duration,
    message_duration: message_duration,
    is_practice: true,
    on_finish: function(){
        practice_type_count++;
    }
}

var instructions_MSIT = [];
instructions_MSIT.push(instructions_MSIT_a);
instructions_MSIT.push(practice_MSIT_intro);
instructions_MSIT.push(practice_MSIT_trials);
instructions_MSIT.push(instructions_MSIT_b);
instructions_MSIT.push(practice_MSIT_intro);
instructions_MSIT.push(practice_MSIT_trials);