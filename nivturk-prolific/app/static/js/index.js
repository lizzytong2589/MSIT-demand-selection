// start time for file naming
var date = '';
var time = '';
var ID;
var completion_code;

// MTurk info
var turkInfo = jsPsych.turk.turkInfo();

// workerID
ID = turkInfo.workerId;

// hitID
turkInfo.hitId;

// assignmentID
turkInfo.assignmentId;

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
        time = time + start_time.getHours() + '-' + start_time.getMinutes() + '-' + start_time.getSeconds();
        if(!ID) {
            ID = jsPsych.randomization.randomID(10);
        }
    },
}

// experiment set-up
var participant_type = "Prolific";
var prolific_ID;
var get_prolific_ID = { // get Prolific ID
    type: 'call-function',
    func: function() {
        prolific_ID = jsPsych.data.getURLVariable('PROLIFIC_PID');
        sessionStorage.setItem('prolific_ID', prolific_ID);

        completion_code = jsPsych.data.getURLVariable('A');
        sessionStorage.setItem('completion_code', completion_code);
        
    }
}

var get_prolific_ID_conditional = {
    timeline: [get_prolific_ID],
    conditional_function: function(){
        if (participant_type == "Prolific") {
            // console.log("got Prolific ID: " + prolific_ID);
            return true;
        } else {
            return false;
        }
    }
}

//// Demand Selection ////
const n_rounds = 2;

// text to display in between rounds
var next_round = {
    type: 'html-button-response',
    stimulus: function() {
        if (current_round != n_rounds) {
            var string = "<p style = 'font-size: 120%'>You have completed "+ current_round + " round(s) of " + n_rounds + "." +
            "<br>When you are ready, please press the button below to continue to the next round.</br></p>";
        } else {
            var string = "<p style = 'font-size: 120%'>You have completed " + current_round + " round(s) of " + n_rounds + "." +
                "<br>You have now completed the task. Please press the button below to continue to the survey.</p>";
        }
        return string;
    },
    choices: ['Continue'],
    on_finish: function() {
        // increment round #
        current_round++;

        // shuffle arrays and reset counters for the round
        dst_index = 0;
        shuffled_choices = jsPsych.randomization.shuffle(shuffled_choices);
        left_or_right = jsPsych.randomization.shuffle(left_or_right);
        show_no_show_MSIT = jsPsych.randomization.shuffle(show_no_show_MSIT);
    }
}

// carry out dst for a set # of rounds
var rounds = {
    timeline: [DST_trials, next_round],
    loop_function: function(){
        return (current_round <= n_rounds);
    },
}

// text to display in between rounds
var end_experiment = {
    type: 'html-button-response',
    stimulus: "<p>Thank you for your participation!</br>Please make sure to submit the following completion code to Prolific so that you can " +
        "receive your payment: </br><strong>" + sessionStorage.getItem('completion_code') + 
    "</strong>.</p>",
    on_start: function() {
        aws_upload();
    },
    choices: ['End'],
    on_finish: function() {
        task_done = true;
    }
}

//  set up experiment structure
var main_timeline = [];
main_timeline.push(welcome);
main_timeline.push(get_prolific_ID_conditional); // for prolific
main_timeline.push(...self_reports);
main_timeline.push(...instructions_MSIT);
main_timeline.push(...instructions_DST);
main_timeline.push(rounds);
main_timeline.push(...survey);
main_timeline.push(end_experiment);


// images for preloading
var instruction_images = MSIT_pagelinks_a.concat(MSIT_pagelinks_b);
instruction_images.push(...DST_pagelinks_a);

// run the experiment
jsPsych.init({
    timeline: main_timeline,
    preload_images: instruction_images,
    exclusions: { 
        min_width: 800,
        min_height: 600
    },
    on_trial_finish: function() {
        aws_upload();
    },
    on_finish: function() {
        aws_upload(); 
        // jsPsych.data.get().localSave('csv','test_results.csv'); //local save


        // Remove requirement to verify redirect
        window.removeEventListener("beforeunload", verify_unload);

        // Add interactions to the data variable
        var interaction_data = jsPsych.data.getInteractionData();
        jsPsych.data.get().addToLast({interactions: interaction_data.json()});

        // Display jsPsych data in viewport.
        // jsPsych.data.displayData();

        // Save complete dataset to disk.
        redirect_success("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_success}}");

        // Save rejected dataset to disk.
        
        // redirect_reject("{{workerId}}", "{{assignmentId}}", "{{hitId}}", "{{code_reject}}");

    }
  })