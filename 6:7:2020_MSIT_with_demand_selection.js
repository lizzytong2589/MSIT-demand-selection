// foraging placeholder and MSIT task with demand selection
// number of tasks in each trial
var number_control_tasks = 6;
var number_congruent_tasks = 6;
var number_incongruent_tasks = 6;

// welcome and enable fullscreen mode
var welcome = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: '<p>Welcome to the experiment. The experiment will switch to fullscreen mode when you press the button below.</p>',
};

// symbols that can be used in each trial
var symbols = [1, 2, 3];

// stimuli for each test: task (symbols), task_type(control, incongruent, congruent), correct_response(1,2,3)
var control = [
    {task: symbols[0] + ' X X', task_type: 'control', correct_response: '1'},
    {task: 'X ' + symbols[1] + ' X', task_type: 'control', correct_response: '2'},
    {task: 'X X ' + symbols[2], task_type: 'control', correct_response: '3'},
];
var congruent = [
    // tasks where answer is 1
    {task: symbols[0] + ' 2 2', task_type: 'congruent', correct_response: '1'},
    {task: symbols[0] + ' 3 3', task_type: 'congruent', correct_response: '1'},

    // tasks where answer is 2
    {task: '1 ' + symbols[1] + ' 1', task_type: 'congruent', correct_response: '2'},
    {task: '3 ' + symbols[1] + ' 3', task_type: 'congruent', correct_response: '2'},

    // tasks where answer is 3      
    {task: '1 1 ' + symbols[2], task_type: 'congruent', correct_response: '3'},
    {task: '2 2 ' + symbols[2], task_type: 'congruent', correct_response: '3'},
]; 
var incongruent = [
    // tasks where answer is 1
    {task: '2 ' + symbols[0] + ' 2', task_type: 'incongruent', correct_response: '1'},
    {task: '3 ' + symbols[0] + ' 3', task_type: 'incongruent', correct_response: '1'},
    {task: '2 2 ' + symbols[0], task_type: 'incongruent', correct_response: '1'},
    {task: '3 3 ' + symbols[0], task_type: 'incongruent', correct_response: '1'},

    // tasks where answer is 2
    {task: '1 1 ' + symbols[1], task_type: 'incongruent', correct_response: '2'},
    {task: '3 3 ' + symbols[1], task_type: 'incongruent', correct_response: '2'},
    {task: symbols[1] + ' 1 1', task_type: 'incongruent', correct_response: '2'},
    {task: symbols[1] + ' 3 3', task_type: 'incongruent', correct_response: '2'},

    // tasks where answer is 3
    {task: symbols[2] + ' 1 1', task_type: 'incongruent', correct_response: '3'},
    {task: symbols[2] + ' 2 2', task_type: 'incongruent', correct_response: '3'},
    {task: '1 ' + symbols[2] + ' 1', task_type: 'incongruent', correct_response: '3'},
    {task: '2 ' + symbols[2] + ' 2', task_type: 'incongruent', correct_response: '3'},
];

// set up counters for foraging task
var number_rounds = 2; // total number of rounds to perform
var current_number_rounds = 0; // number of foraging rounds (travel and harvest)
var this_round_choices = 0; // number of decisions made in current round
var travel_harvest = true;
var number_harvests_before_travel = 0; // number of times user harvests before travelling
var number_travels = 0; // number of times travel has been called in the round
var MSIT_tasks_performed = 0; // number of MSIT tasks performed in one travel period
var set_round_time = 10; // total desired round time in seconds
var round_start_time = []; // array to hold start times (since beginning of experiment) of each foraging round
var current_round_time = 0; // time elapsed relative to round start time
var current_round_time_sec = 0;
var timeout = false;
var congruent_or_incongruent = true; // congruent is true, incongruent is false
var MSIT_stimuli = []; // MSIT tasks for the round
var is_missed = false; 
var fixation_time = 250;

var end_round = function(){
    jsPsych.endCurrentTimeline();
    timeout = true;
    console.log('timeout');
    // jsPsych.data.get().localSave('csv', 'Round ' + current_number_rounds + '.csv');
};

var harvest = {
    type: 'html-keyboard-response',
    stimulus: 'Placeholder for harvest tasks. Press f to travel and j to continue harvesting.',
    choices: ['f','j'],
    on_finish: function(data) {
        var choice = data.key_press;
        if (this_round_choices != 0 && timeout) {
            travel_harvest = false;
            data.round = current_number_rounds;
            data.choice_number = "timeout";
            data.current_round_time = "timeout";

        }
        // set data for harvest or travel
        else if (choice == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('j')){
            travel_harvest = true;
            if (this_round_choices == 0 && current_number_rounds < number_rounds) {
                timeout = false;
                current_number_rounds++;
                current_round_time = 0;
                round_start_time.push(data.time_elapsed);
                setTimeout(function(){end_round()}, set_round_time*1000); // total round time
            } else {
                current_round_time = data.time_elapsed - round_start_time[current_number_rounds - 1];
                current_round_time_sec = current_round_time/1000;
            }
            number_harvests_before_travel++;
            this_round_choices++;

            // write data
            data.task_choice = 'harvest';
            data.round = current_number_rounds;
            // data.round_start = round_start_time[current_number_rounds - 1];
            data.choice_number = this_round_choices;
            data.current_round_time = current_round_time;
            data.number_harvests_before_travel = number_harvests_before_travel;
            data.number_travels_in_round = number_travels;
            data.task_type = 'foraging';
        } else if (choice == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('f')){
            travel_harvest = false;
            if (this_round_choices == 0 && current_number_rounds < number_rounds) {
                timeout = false;
                current_number_rounds++;
                current_round_time = 0;
                round_start_time.push(data.time_elapsed);
                setTimeout(function(){end_round()}, set_round_time*1000);
                console.log(timeout);
            } else {
                current_round_time = data.time_elapsed - round_start_time[current_number_rounds - 1];
                current_round_time_sec = current_round_time/1000;
            }
            number_travels++;
            this_round_choices++;
            MSIT_tasks_performed = 0;

            // write data
            data.task_choice = 'travel';
            data.round = current_number_rounds;
            // data.round_start = round_start_time[current_number_rounds - 1];
            data.choice_number = this_round_choices;
            data.current_round_time = current_round_time;
            data.number_harvests_before_travel = number_harvests_before_travel;
            number_harvests_before_travel = 0; // reset number of harvests
            data.number_travels_in_round = number_travels;
            data.task_type = 'foraging';
        } 
        // console.log(current_number_rounds);
        // console.log(current_round_time);
   },
}   

// repeat harvest screen or move on to travel task
var travel_or_harvest = {
    timeline: [harvest],
    loop_function: function(data){
        if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('j') == data.values()[0].key_press){
            console.log('harvest');                  
            return travel_harvest;
        } else {
            console.log('travel');
            return travel_harvest;
        }
    },
}

// fixation cross in between trials
var fixation = {
    type: 'html-keyboard-response',
    stimulus: function(){
        if(timeout) {
            return "";
        } else {
            var stimulus =  '<div style="font-size:60px;">+</div>';
            return stimulus;
        }
    },
    choices: jsPsych.NO_KEYS, // no user inputs accepted
    trial_duration: function(){
        if(timeout) {
            return 0;
        } else {
            return fixation_time;
        }
    },
    on_finish: function(data) {
        current_round_time = data.time_elapsed - round_start_time[current_number_rounds - 1];
        current_round_time_sec = current_round_time/1000;

        // data.task_choice = 'travel';
        data.task_type = 'fixation';
        data.stimulus= '+';
        data.round = current_number_rounds;
        // data.round_start = round_start_time[current_number_rounds - 1];
        data.choice_number = this_round_choices;
        data.current_round_time = current_round_time;
        // data.number_harvests_before_travel = number_harvests_before_travel;
        data.number_travels_in_round = number_travels;
    },
};

 // show test stimulus; blank screen runs for 0 sec if number of tasks reached
 var current_task = {};
 var MSIT_task = {
    type: "html-keyboard-response",
    stimulus: function(){
        if(timeout) {
            return "";
        } else {
            current_task = MSIT_stimuli.pop();
            var stimulus = "<p class='task'>"+ current_task['task'] +"</p>";
            return stimulus;
        } 
    },
    stimulus_duration: 1000, // time task is shown 
    trial_duration: function(){
        if(timeout) {
            return 0;
        } else {
            return 1000;
        }
    },
    choices: ['1','2','3'],
    on_start: function(){
        if (MSIT_tasks_performed > number_congruent_tasks) {
            jsPsych.endCurrentTimeline();
        }
    },
    on_finish: function(data){
        current_round_time = data.time_elapsed - round_start_time[current_number_rounds - 1];
        data.current_round_time = current_round_time;
        data.round = current_number_rounds;
        data.choice_number = this_round_choices;
        data.number_travels_in_round = number_travels;
        if(timeout) {
            data.stimulus = "timeout";
            data.task_type = "timeout";
            data.key_press = "timeout";
            data.correct = "timeout";
            data.correct_response = "timeout";
            data.rt = "timeout";
            data.task_number = "timeout";
        } else {
            MSIT_tasks_performed++
            data.stimulus = current_task['task'];
            data.task_type = current_task['task_type'];
            data.correct_response = current_task['correct_response'],
            // console.log('number of MSIT tasks performed: ' + MSIT_tasks_performed);
            data.round = current_number_rounds;
            // data.task_choice = 'travel';
            data.task_number = MSIT_tasks_performed;
            // console.log(current_task.correct_response);
            if(data.key_press == null) {
                data.correct = "is_missed"; // is missed variable for no response
                data.rt = "is_missed";
                data.is_missed = true;
            } else {
                data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
                data.key_press = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
                data.is_missed = false;
            }
        }
    },
}

// check how many MSIT tasks have been performed in the travel task
var MSIT_task_conditional = {
    timeline: [fixation, MSIT_task],
    conditional_function: function() {
        return (MSIT_tasks_performed < number_congruent_tasks)
    },
}

// runs the MSIT procedure
var MSIT_procedure = {
    timeline: [MSIT_task_conditional], // create new timeline
    loop_function: function(){
        return (!timeout && (MSIT_tasks_performed < number_congruent_tasks));
    },
};

// blank screen for if time runs out
var travel_timeout = {
    type: "html-keyboard-response",
    stimulus: "",
    trial_duration: 0,

}

// check whether time is up
var travel = {
    timeline: [MSIT_procedure],
    conditional_function: function(){
        // run MSIT task if still time; continue to blank screen if no time left in the round
        return !timeout;
    }
}

var travel_conditional = {
    timeline: [travel, travel_timeout],
};

// choice of set of travel tasks by user
var get_travel_choice = {
    type: 'html-keyboard-response',
    stimulus: function(){
        if(timeout) {
            return "";
        } else {
            var stimulus = "<p>" + number_congruent_tasks + " congruent tasks or " + number_incongruent_tasks + " incongruent tasks</p>";
            return stimulus;
        } 
    },
    prompt: function(){
        if(timeout) {
            return "";
        } else {
            var prompt = "<p><b>Press 1 for the congruent tasks and 3 key for the incongruent tasks.</b></p>";
            return prompt;
        } 
    },
    choices: ['1','3'],
    trial_duration: function(){
        if(timeout) {
            return 0;
        } else {
            return null;
        }
    },
    on_finish: function(data) {
        MSIT_stimuli = [];
        data.round = current_number_rounds;
        data.task_type = 'travelling';
        
        // true for congruent tests choice; stays false for incongruent
        if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('1')) {
            data.travel_choice = "congruent";
            congruent_or_incongruent = true;
            var stimuli = jsPsych.randomization.sampleWithReplacement(congruent, number_congruent_tasks);
            MSIT_stimuli.push(...stimuli);
            // console.log("run congruent tasks");
        } else {
            data.travel_choice = "incongruent";
            congruent_or_incongruent = false;
            var stimuli = jsPsych.randomization.sampleWithReplacement(incongruent, number_incongruent_tasks);
            MSIT_stimuli.push(...stimuli);
            // console.log("run incongruent tasks");
        };
    },
};

var MSIT_and_foraging = {
    timeline: [travel_or_harvest, get_travel_choice, travel_conditional],
    loop_function: function() { // loop function runs after travel task
        return (!timeout);
    },
}

var next_round = {
    type: "html-keyboard-response",
    stimulus: function() {
        if (current_number_rounds != number_rounds) {
            var string = "<p>You have completed "+ current_number_rounds + " round(s) of " + number_rounds + ".</p>"+
            "<br>When you are ready, please press the space key to continue to the next round.</br>";
            
        } else if (current_number_rounds == number_rounds){
            var string = "<p>You have completed "+ current_number_rounds + " round(s) of " + number_rounds + ".</p>"+
            "<br>Thank you for participating in this experiment. You may now close this page.</br>";
        }
        return string;
    },
    choices: ['space'],
}

var rounds = {
    timeline:[MSIT_and_foraging, next_round],
    loop_function: function(){
        // console.log(current_number_rounds);
        number_travels = 0; // reset counter for number of travels in the round
        this_round_choices = 0; // reset counter for number of choices that have been made
        return (current_number_rounds < number_rounds);
    },
}

// function to add data
var compile_data = function(data){
    jsPsych.data.write(data);
}

// summary of MSIT data
var write_data = {
    type: 'call-function',
    func: function(){ 
        // filter data into categories
        var control_data = jsPsych.data.get().filter({task_type: 'control'}); // get control trials data
        var congruent_data = jsPsych.data.get().filter({task_type: 'congruent'}); // get congruent trials data
        var incongruent_data = jsPsych.data.get().filter({task_type: 'incongruent'}); // get incongruent trials data

        // get number of correct trials per category
        var correct_control = control_data.filter({correct: true});
        var correct_congruent = congruent_data.filter({correct: true});
        var correct_incongruent = incongruent_data.filter({correct: true});

        // calculate accuracy
        var accuracy_control = Math.round(correct_control.count() / control_data.count() * 100);
        var accuracy_congruent = Math.round(correct_congruent.count() / congruent_data.count() * 100);
        var accuracy_incongruent = Math.round(correct_incongruent.count() / incongruent_data.count() * 100);

        // get reaction times
        var mean_rt_control = Math.round(correct_control.select('rt').mean());
        var mean_rt_congruent = Math.round(correct_congruent.select('rt').mean());
        var mean_rt_incongruent = Math.round(correct_incongruent.select('rt').mean());

        var data = {
            fixation_time: fixation_time,
            accuracy_control: accuracy_control,
            mean_rt_control: mean_rt_control, 
            accuracy_congruent: accuracy_congruent,
            mean_rt_congruent: mean_rt_congruent,
            accuracy_incongruent: accuracy_incongruent,
            mean_rt_incongruent: mean_rt_incongruent,
        };

        compile_data(data)},
}

//  set up experiment structure
var timeline = [];
timeline.push(welcome);
timeline.push(...instructions);
timeline.push(rounds);  
timeline.push(write_data);


// start experiment
jsPsych.init({
    timeline: timeline,
    // on_close: function() {
    //     jsPsych.data.get().localSave('csv','results.csv');
    // },
    on_finish: function() {
        // jsPsych.data.get().localSave('csv','results.csv');

        // var results = jsPsych.data.get();
        // results.ignore('trial_type').ignore('key_press').ignore('trial_type').ignore('internal_node_id').localSave('csv','edited_results.csv');
        // results1 = results.ignore('trial_type');
        // results2 = results.ignore('key_press');
        // results3 = results.ignore('key_press');
        // results4 = results.ignore('internal_node_id');
        // results4.localSave('csv','results.csv');
        jsPsych.data.get().ignore('trial_type').localSave('csv','results.csv');
    },
});