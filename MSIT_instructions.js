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
                                'Stimuli/MSIT_instructions/Slide20.png',
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
                                'Stimuli/MSIT_instructions/Slide31.png',  
];

var MSIT_pages_a = [];
for (var i = 0; i < MSIT_pagelinks_a.length; i++){
    MSIT_pages_a.push('<img src= "'+ MSIT_pagelinks_a[i] +  '" alt = "" >')
}

var MSIT_instructions_a = {
    type: 'instructions',
    pages: MSIT_pages_a,
    show_clickable_nav: true
}

// CONGRUENT INTRO
var matching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight: bold'>Let's try out the <span style ='color:blue'>matching</span> tasks! </span><br> Press any key to start.</p>"
}

// congruent tasks
const n_practice = 4;
var congruent_tasks_performed = 0;
var correct = false;
var current_correct_key = 0;
var match_task = {
    type: 'MSIT',
    n_MSIT_tasks: 1,
    MSIT_task_duration: 1000,
    MSIT_task_type: 'congruent',
    fixation_duration: 250,
    is_practice: true,
    on_finish: function(data) {
        congruent_tasks_performed++;
        data.MSIT_tasks_performed = congruent_tasks_performed;
    }
}

var feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    on_start: function(trial) {
        var practice_MSIT_data = jsPsych.data.get().last(2).values()[0];
        // console.log(practice_MSIT_data);
        current_correct_key = practice_MSIT_data['correct_response'];
        var current_key_pressed = practice_MSIT_data['key_press'];
        if (current_correct_key == current_key_pressed) {
            trial.stimulus = "<p><span style = 'font-size: 200%; font-weight: bold'>That was correct!</span><br>" +
            "Press any key to continue.</p>";
        } else {
            incorr_str = "<span style = 'font-size: 200%; font-weight: bold'>Sorry, that was incorrect. " +
                "The oddball was " + current_correct_key + ".</span><br>Press any key to continue.</p>";
            trial.stimulus = incorr_str;
        }
    },
}

// run through practice congruent trials
var practice_congruent = [match_task, feedback];
var loop_congruent = {
    timeline: practice_congruent,
    loop_function: function() {
      return (congruent_tasks_performed < n_practice) 
    }
}


// INCONGRUENT INTRO
var mismatching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p><span style = 'font-size: 200%; font-weight:bold'>Let's try out the <span style ='color:orange'>mismatching</span> tasks! </span></br> Press any key to start.</p>"
}

// incongruent tasks
var incongruent_tasks_performed = 0;
var mismatch_task = {
    type: 'MSIT',
    n_MSIT_tasks: 1,
    MSIT_task_duration: 1000,
    MSIT_task_type: 'incongruent',
    fixation_duration: 250,
    is_practice: true,
    on_finish: function(data) {
        incongruent_tasks_performed++;
        data.MSIT_tasks_performed = incongruent_tasks_performed;
    }
}

// run through practice incongruent trials
var practice_incongruent = [mismatch_task, feedback];
var loop_incongruent = {
    timeline: practice_incongruent,
    loop_function: function() {
      return (incongruent_tasks_performed < n_practice) 
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
instructions.push(loop_congruent);
instructions.push(mismatching_intro);
instructions.push(loop_incongruent);
instructions.push(end_instructions);
