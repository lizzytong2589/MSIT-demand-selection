// start time for file naming
var date = '';
var time = '';
var ID;
var completion_code = jsPsych.randomization.randomID(10);
var consent_initials;
var consent_date;

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
    // TO DO: uncomment before putting online
    // on_finish: function(){
    //     aws_upload();
    // }
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
                "</br>Thank you for participating in this experiment. This is your MTurk completion code: <strong>" + completion_code + "</strong>.</p></br>" +
                "Please make sure to submit this code to MTurk so that you can receive your payment.</br></p>";
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

// wrap so that consent page displayed first
function run_task() {
    // start experiment
    jsPsych.init({
        timeline: main_timeline,
        exclusions: {
            min_width: 800,
            min_height: 600
        },
        preload_images: instruction_images,
        on_finish: function() {
            task_done = true;
            aws_upload();
        },
    });
}

// CONSENT INFORMATION AND FORM
// check that consent form is filled out properly
var check_consent = function (elem) {
    check_consent_initials = (document.querySelector('#consent-1').querySelector('textarea, input')).checkValidity();
    check_consent_date = (document.querySelector('#consent-2').querySelector('textarea, input')).checkValidity();
    
    if (check_consent_initials && check_consent_date) {
        task_started = true;
        sessionStorage.setItem('consent_initials', document.querySelector('#consent-1').querySelector('textarea, input').value);
        sessionStorage.setItem('consent_date', document.querySelector('#consent-2').querySelector('textarea, input').value);
        run_task();
    } else if (!check_consent_initials && !check_consent_date) {
        alert("Please make sure you have entered your initials and today's date following the indicated format");
        return false;
    } else if (check_consent_initials && !check_consent_date) {
        alert("Please make sure you have entered today's date following the indicated format. (MM/DD/YYYY)");
        return false;
    } else if (!check_consent_initials && check_consent_date) {
        alert("Please make sure you have entered your initials following the indicated format. (AA)");
        return false;
    } 
};

// consent
var MTurk_payment = 6;
var study_time = 30;
document.getElementById('header_title').innerHTML = "Psychology Experiment - Informed Consent Form";
document.getElementById("consent").innerHTML = "<div style = 'text-align: justify; text-justify: inter-word'>" +
    "<p>You have been invited to take part in a research study.</p>" +

    "<p><strong>TITLE OF RESEARCH:</strong> Behavioral and fMRI Studies of Decision Making and Cognitive Performance</p>" +
    "<p><strong>INVESTIGATORS:</strong> Jonathan D. Cohen, M.D., Ph.D.; Matthew Botvinick, M.D., Ph.D.; Leigh Nystrom, Ph.D.; " +
    "Amitai Shenhav, Ph.D.; Marius Catalin Iordan, Ph.D.; Sebastian Musslick; Wouter Kool; Kevin Miller; Mark Straccia; Jin Hyun Cheong; " +
    "Abigail Novick; Gecia Bravo Hermsdorff; Gus Baker; Laura Bustamante; Keith Perkins; Candace Rissi-Wise; Natsuko Sato; Cameron Ellis; " +
    "Markus Spitzer; Seong Jang; Tolulope Adetayo; Chloe Hoeber; Allison Burton; Katie Tam; Thea Zalabak; Aaron Bornstein; Mannaseh Alexander; " +
    "Temitope Oshinowo; Zsombor Gal; Tyler Giallanza; Connor Lawhead</p>" +
    
    "<p>The following informed consent is required by Princeton University for any person involved in a research study conducted by investigators " +
    "at the University. This study has been approved by the University's Institutional Review Board for Human Subjects.</p>" +

    "<p>In this task, you will be asked to make judgements about objects. " +
    "</p>The study will take approximately " + study_time + " minutes to complete, and you will be awarded $" + MTurk_payment + " for your participation.</p>" +
    
    "<p><strong>If you have any questions about this study, your payment, or the research being conducted, you may contact the research team at:</strong> " +
    "<a href=\"mailto:harvestingstudy@princeton.edu\">harvestingstudy@princeton.edu</a>.</p>" +
    "<p> If you have questions regarding your rights as a research subject, or if problems arise which you do not feel you can discuss with the " +
    "Investigator, please contact the Institutional Review Board at: " +
    "</br><span class = 'tab'>Office of Research Integrity and Assurance</span>" +
    "</br><span class = 'tab'>Compliance Administrator</span>" +
    "</br><span class = 'tab'>Phone: <a href='tel: 609-258-0865'>(609) 258-0865</a></span>" +
    "</br><span class = 'tab'>Email: <a href=\"mailto:irb@princeton.edu\">irb@princeton.edu</a></span>" +

    "<p>By continuing with the study, you affirm that: Your participation is voluntary, and you may withdraw your consent and discontinue" +
    "participation in the project at any time. Your refusal to participate will not result in any penalty. By signing this agreement, you do not " +
    "waive any legal rights or release Princeton University, its agents, or you from liability for negligence. There may be no direct benefit to you " +
    "from participation in this study other than the monetary payment as described above, though there may be indirect benefits as a result of what we " +
    "learn about the human mind from your participation. The information obtained from this study will be confidential. It will be available to the " +
    "investigators performing the study. Your worker ID will be anonymized and your identity will remain anonymous in any publications resulting from " +
    "this study. You are a legal adult at your jurisdiction. This means you are 21 or older if you are in Mississippi; 19 or older if you are in Alabama, " +
    "Delaware, and Nebraska; 18 or older in another state, or an emancipated minor according to your local laws. This document and/or additional email " +
    "communication with the investigators answered any questions that you have regarding the study.</p></br>" +

    "<form id='consent-form' action = '#'>" +
        // initials
        "<span id='consent-1' style='margin: 2em 0em'>" +
            "<label for='#input-1'>Please enter your initials to consent:</label>" +
            "<input form = 'consent-form' type='text' autocomplete = 'off' id = 'input-1' size='15' " +
            "placeholder ='AE' pattern = '^([A-Z]{2,})$' required aria-required='true'/>" +
        "</span></br>" +
        // date of consent
        "<span id='consent-2' style='margin: 2em 0em'>" +
            "<label for='#input-2'>Please enter today\'s date to consent: </label>" +
            "<input form = 'consent-form' type='text' autocomplete = 'off' id='input-2' size='15'" +
            "placeholder = 'MM/DD/YYYY' pattern = '^((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)[0-9][0-9])$' required aria-required='true'/>" +
        "</span>" + 
    "</form>" +
    "</div>" +

    "<br><button type = 'button' id='start' class='submit_button'>continue</button><br><br>";

// check if consent filled out
document.getElementById("start").onclick = check_consent;
let consent_input_1 = document.getElementById("input-1");
let consent_input_2 = document.getElementById("input-2");

// Call check function if enter key pressed
consent_input_1.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    check_consent();
    }
});
consent_input_2.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    check_consent();
    }
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this experiment does not work on mobile devices");
    document.getElementById('consent').innerHTML = "";
}