var MSIT_pagelinks_a = ['../static/Instructions/instructions_MSIT/Slide01.PNG', // welcome
                            '../static/Instructions/instructions_MSIT/Slide02.PNG',
                            '../static/Instructions/instructions_MSIT/Slide03.PNG',
                            '../static/Instructions/instructions_MSIT/Slide04.PNG',
                            '../static/Instructions/instructions_MSIT/Slide05.PNG',
                            '../static/Instructions/instructions_MSIT/Slide06.PNG',
                            '../static/Instructions/instructions_MSIT/Slide07.PNG',
                            '../static/Instructions/instructions_MSIT/Slide08.PNG',
                            '../static/Instructions/instructions_MSIT/Slide09.PNG',
                            '../static/Instructions/instructions_MSIT/Slide10.PNG',
                            '../static/Instructions/instructions_MSIT/Slide11.PNG',
                            '../static/Instructions/instructions_MSIT/Slide12.PNG',
];

var MSIT_pagelinks_b = ['../static/Instructions/instructions_MSIT/Slide13.PNG',
                            '../static/Instructions/instructions_MSIT/Slide14.PNG',
                            '../static/Instructions/instructions_MSIT/Slide14a.PNG',
                            '../static/Instructions/instructions_MSIT/Slide15.PNG',
                            '../static/Instructions/instructions_MSIT/Slide16.PNG',
                            '../static/Instructions/instructions_MSIT/Slide16a.PNG',
                            '../static/Instructions/instructions_MSIT/Slide17.PNG',
                            '../static/Instructions/instructions_MSIT/Slide18.PNG',
                            '../static/Instructions/instructions_MSIT/Slide18a.PNG',
];

var MSIT_pagelinks_c = ['../static/Instructions/instructions_MSIT/Slide19.PNG', // You will now practice the matching...
];

var MSIT_pagelinks_d = ['../static/Instructions/instructions_MSIT/Slide20.PNG',
                            '../static/Instructions/instructions_MSIT/Slide21.PNG',
                            '../static/Instructions/instructions_MSIT/Slide21a.PNG',
                            '../static/Instructions/instructions_MSIT/Slide22.PNG',
                            '../static/Instructions/instructions_MSIT/Slide23.PNG',
                            '../static/Instructions/instructions_MSIT/Slide23a.PNG',
                            '../static/Instructions/instructions_MSIT/Slide24.PNG',
                            '../static/Instructions/instructions_MSIT/Slide25.PNG',
                            '../static/Instructions/instructions_MSIT/Slide25a.PNG',
];

var MSIT_pagelinks_e = ['../static/Instructions/instructions_MSIT/Slide26.PNG', // You will now practice the mismatching...
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

var MSIT_pages_c = [];
for (var i = 0; i < MSIT_pagelinks_c.length; i++){
    MSIT_pages_c.push('<img src= "'+ MSIT_pagelinks_c[i] +  '" alt = "" >')
}

var MSIT_pages_d = [];
for (var i = 0; i < MSIT_pagelinks_d.length; i++){
    MSIT_pages_d.push('<img src= "'+ MSIT_pagelinks_d[i] +  '" alt = "" >')
}

var MSIT_pages_e = [];
for (var i = 0; i < MSIT_pagelinks_e.length; i++){
    MSIT_pages_e.push('<img src= "'+ MSIT_pagelinks_e[i] +  '" alt = "" >')
}



const wait_time_MSIT = 3.7 * 1000;

var instructions_MSIT_a = {
    type: 'instructions',
    pages: MSIT_pages_a,
    wait_time: wait_time_MSIT,
    show_clickable_nav: true,
}

var instructions_MSIT_b = {
    type: 'instructions-automatic',
    pages: MSIT_pages_b,
    wait_time: wait_time_MSIT,
    show_clickable_nav: true,
}

var instructions_MSIT_c = {
    type: 'instructions',
    pages: MSIT_pages_c,
    wait_time: wait_time_MSIT,
    show_clickable_nav: true,
}

var instructions_MSIT_d = {
    type: 'instructions-automatic',
    pages: MSIT_pages_d,
    wait_time: wait_time_MSIT,
    show_clickable_nav: true,
}

var instructions_MSIT_e = {
    type: 'instructions',
    pages: MSIT_pages_e,
    wait_time: wait_time_MSIT,
    show_clickable_nav: true
}

//////// PRACTICE MSIT TRIALS ////////
const n_practice_MSIT = 30; // keep number trials same for practice matching and mismatching
const fixation_duration = 250;
const message_duration = 1000;
const MSIT_trial_duration = 1000;
var practice_MSIT_trial_types = ['matching', 'mismatching'];
var practice_type_count = 0;

// Practice trials intro screen
var practice_MSIT_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    choices: ['space'],
    prompt: function() {
        if(practice_MSIT_trial_types[practice_type_count] == 'matching') {
            return "<p><span style = 'font-size: 200%; font-weight: bold'>Let's try out some " +
            "<span class ='match'>matching</span> trials! </span><br> Please press space to start.</p>";
        } else {
            return "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out some "+
            "<span class ='mismatch'>mismatching</span> trials! </span></br> Please press space to start.</p>"
        }
    },
}

var practice_MSIT_trials = {
    type: 'MSIT',
    round: 0,
    n_MSIT_trials: n_practice_MSIT,
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
instructions_MSIT.push(instructions_MSIT_b); // matching
instructions_MSIT.push(instructions_MSIT_c);
instructions_MSIT.push(practice_MSIT_intro);
instructions_MSIT.push(practice_MSIT_trials);
instructions_MSIT.push(instructions_MSIT_d); // mismatching
instructions_MSIT.push(instructions_MSIT_e);
instructions_MSIT.push(practice_MSIT_intro);
instructions_MSIT.push(practice_MSIT_trials);
