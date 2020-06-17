var MSIT_pagelinks_a = ['Stimuli/MSIT_instructions/Slide1.PNG',
                                'Stimuli/MSIT_instructions/Slide2.PNG',
                                'Stimuli/MSIT_instructions/Slide3.PNG',
                                'Stimuli/MSIT_instructions/Slide4.PNG',
                                'Stimuli/MSIT_instructions/Slide5.PNG',
                                'Stimuli/MSIT_instructions/Slide6.PNG',
                                'Stimuli/MSIT_instructions/Slide7.PNG',
                                'Stimuli/MSIT_instructions/Slide8.PNG',
                                'Stimuli/MSIT_instructions/Slide9.PNG',
                                'Stimuli/MSIT_instructions/Slide10.PNG',
                                'Stimuli/MSIT_instructions/Slide11.PNG',
                                'Stimuli/MSIT_instructions/Slide12.PNG',
                                'Stimuli/MSIT_instructions/Slide13.PNG',
                                'Stimuli/MSIT_instructions/Slide14.PNG',
                                'Stimuli/MSIT_instructions/Slide15.PNG',
                                'Stimuli/MSIT_instructions/Slide16.PNG',
                                'Stimuli/MSIT_instructions/Slide17.PNG',
                                'Stimuli/MSIT_instructions/Slide18.PNG',
                                'Stimuli/MSIT_instructions/Slide19.PNG',
                                'Stimuli/MSIT_instructions/Slide20.PNG',
                                'Stimuli/MSIT_instructions/Slide21.PNG',
                                'Stimuli/MSIT_instructions/Slide22.PNG',
                                'Stimuli/MSIT_instructions/Slide23.PNG',
                                'Stimuli/MSIT_instructions/Slide24.PNG', 
                                'Stimuli/MSIT_instructions/Slide25.PNG',
                                'Stimuli/MSIT_instructions/Slide26.PNG',
                                'Stimuli/MSIT_instructions/Slide27.PNG',
                                'Stimuli/MSIT_instructions/Slide28.PNG',
                                'Stimuli/MSIT_instructions/Slide29.PNG',
                                'Stimuli/MSIT_instructions/Slide30.PNG',
                                'Stimuli/MSIT_instructions/Slide31.PNG',  
];

var pages_a = [];
for (var i = 0; i < MSIT_pagelinks_a.length; i++){
    pages_a.push('<img src= "'+ MSIT_pagelinks_a[i] +  '" alt = "" >')
}

var instruction_pages_a = {
    type: 'instructions',
    pages: pages_a,
    show_clickable_nav: true
}

// CONGRUENT INTRO
var matching_intro = {
    type: 'html-keyboard-response',
    stimulus:'',
    prompt: "<p>Let's try out the <span style ='color:blue'>matching</span> tasks! <br> Press any key to start.</p>"
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
        data.n_MSIT_tasks_performed = congruent_tasks_performed;
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
            trial.stimulus = "<p><span style = 'font-size: larger; font-weight: bold'>That was correct!</span><br>Press any key to continue."
        } else {
            incorr_str = "<span style = 'font-size: larger; font-weight: bold'>Sorry, that was incorrect. The oddball was " + current_correct_key + ".</span><br>Press any key to continue.";
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
    prompt: "<p>Let's try out the <span style ='color:orange'>mismatching</span> tasks! </br> Press any key to start.</p>"
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
        data.n_MSIT_tasks_performed = incongruent_tasks_performed;
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
            trial.stimulus = "<p><span style = 'font-size: larger; font-weight: bold'>That was correct!</span><br>Press any key to continue."
        } else {
            incorr_str = "<span style = 'font-size: larger; font-weight: bold'>Sorry, that was incorrect. The oddball was " + current_correct_key + ".</span><br>Press any key to continue.";
            trial.stimulus = incorr_str;
        }
    },
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
    stimulus: "<p>Great job! Now you're ready to start the experiment!</p>",
}

var instructions = [];
instructions.push(instruction_pages_a);
instructions.push(mismatching_intro);
instructions.push(loop_incongruent);
instructions.push(matching_intro);
instructions.push(loop_congruent);
instructions.push(end_instructions);