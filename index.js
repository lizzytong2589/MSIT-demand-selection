// start time for file naming
var date = '';
var time = '';
var ID;

// MTurk info
var turkInfo = jsPsych.turk.turkInfo();

// workerID
ID = turkInfo.workerId

// hitID
turkInfo.hitId

// assignmentID
turkInfo.assignmentId

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
            var string = "<p style = 'font-size: 120%'>You have completed " + current_round + " round(s) of " + n_rounds + "."+
            "<br>Thank you for participating in this experiment. You may now close this page.</br></p>";
        }
        return string;
    },
    choices: function() {
        if (current_round != n_rounds) {
            return ['Continue'];
        } else {
            return ['End'];
        }
    },
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

//  set up experiment structure
var main_timeline = [];
main_timeline.push(welcome);
main_timeline.push(...instructions_MSIT);
main_timeline.push(...instructions_DST);
main_timeline.push(rounds);

// images for preloading
var instruction_images = MSIT_pagelinks_a.concat(MSIT_pagelinks_b);
instruction_images.concat(DST_pagelinks_a);

// start experiment
jsPsych.init({
    timeline: main_timeline,
    exclusions: {
        min_width: 800,
        min_height: 600
    },
    preload_images: instruction_images,
    // on_close: function() {
    //     if (!task_done) {
    //         aws_upload();
    //     }
    // },
    on_finish: function() {
        aws_upload();
        task_done = true;
        close();

    },
});