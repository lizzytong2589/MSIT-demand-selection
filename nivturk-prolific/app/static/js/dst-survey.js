// Create Labels
var left_right_options = ["right hand", "left hand"];
var ami_scale = ["Completely UNTRUE", "Mostly untrue", "Neither true or untrue", "Completely TRUE"];
var phq9_gad7_scale = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
var phq9_impact_options = ["Not difficult at all", "Somewhat difficult", "Very difficult", "Extremely difficult"];
var nfc_scale = ["extremely uncharacteristic", "somewhat uncharacteristic", "uncertain", "somewhat characteristic", "extremely characteristic"];
var shaps_scale = ["strongly disagree", "disagree", "agree", "strongly agree"];
var dst_effort_scale = ["1- Least effortful", "2", "3", "4", "5- Most effortful"];
var dst_enjoyment_scale = ["1- Least enjoyable", "2", "3", "4", "5- Most enjoyable"];
var dst_trials_preference_options = ["matching", "mismatching"];
var dst_boring_options = ["1- Not boring at all", "2", "3", "4", "5- Extremely boring"];
var sex_options = ["Male", "Female", "Intersex", "Prefer not to answer"];
var handedness_options = ["Left", "No Preference (Ambidextrous)", "Right", "Prefer not to answer"];

var race_options= ["American Indian/Alaskan Native", 
    "Black or African American", 
    "Asian", 
    "White", 
    "Native Hawaiian or other Pacific Islander",
    "More than One Race",
    "Prefer not to answer",
];

var hispanic_latino_options = ["Yes", "No", "Prefer not to answer"];
var income_level_childhood_options = ["1- Low", "2", "3", "4", "5- Average", "6", "7", "8", "9", "10- High"];

var income_level_now_options = ["Less than $25,000", 
    "$25,000 to $34,999", 
    "$35,000 to $49,999", 
    "$50,000 to $74,999", 
    "$75,000 to $99,999", 
    "$100,000 to $149,999", 
    "$150,000 to $199,999", 
    "200,000 or more", 
    "Prefer not to answer",
];

var student_options = ["No", "Yes (Full-time)", "Yes (Part-time)", "Prefer not to answer"];

var demographics_edu_options = ["Not Applicable/Unknown",
    "Less than seven years of school", 
    "Seven to nine years of school (Junior high/Middle School)",
    "Ten to 11 years of school (part high school) has completed", 
    "High school graduate",
    "One to three years college (also business schools)",
    "Four-year college graduate (BA, BS, BM)",
    "Professional Degree (MA, MS, ME, MD, PhD, LLD)",
    "Prefer not to answer",
];


//survey questions
var nfc = {
    type: 'survey-likert',
    preamble: "<div>For each of the statements below, please indicate to what extent the statement is characteristic of you.<br>" +
        'If the statement is extremely uncharacteristic of you (not at all like you) please select "extremely uncharacteristic;"<br>' +
        'if the statement is extremely characteristic of you (very much like you) please select "extremely characteristic".<br>' +
        'Of course, a statement may be neither extremely uncharacteristic nor extremely characteristic of you;<br>' +
        'if so, please use the choice in the middle of the scale ("uncertain") that describes the best fit.<br>',
    questions: [
        {prompt: 'I would prefer complex to simple problems.', name: "ncf 1", labels: nfc_scale, required: true},
        {prompt: 'I like to have the responsibility of handling a situation that requires a lot of thinking.', name: "nfc 2",  labels: nfc_scale, required: true},
        {prompt: 'Thinking is not my idea of fun.', name: "nfc 3", labels: nfc_scale, required: true},
        {prompt: 'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.', name: "nfc 4", labels: nfc_scale, required: true},
        {prompt: 'I try to anticipate and avoid situations where there is a likely chance I will have to think in depth about something.', name: "nfc 5", labels: nfc_scale, required: true},
        {prompt: 'I find satisfaction in deliberating hard and for long hours.', name: "nfc 6", labels: nfc_scale, required: true},
        {prompt: 'I only think as hard as I have to.', name: "nfc 7", labels: nfc_scale, required: true},
        {prompt: 'I prefer to think about small daily projects to long term ones.', name: "nfc 8", labels: nfc_scale, required: true},
        {prompt: "I like tasks that require little thought once I've learned them.", name: "nfc 9", labels: nfc_scale, required: true},
        {prompt: 'The idea of relying on thought to make my way to the top appeals to me.', name: "nfc 10", labels: nfc_scale, required: true},
        {prompt: 'I really enjoy a task that involves coming up with new solutions to problems.', name: "nfc 11", labels: nfc_scale, required: true},
        {prompt: "Learning new ways to think doesn't excite me very much.", name: "nfc 12", labels: nfc_scale, required: true},
        {prompt: 'I prefer my life to be filled with puzzles I must solve.', name: "nfc 13", labels: nfc_scale, required: true},
        {prompt: 'The notion of thinking abstractly is appealing to me.', name: "nfc 14", labels: nfc_scale, required: true},
        {prompt: 'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.', name: "nfc 15", labels: nfc_scale, required: true},
        {prompt: 'I feel relief rather than satisfaction after completing a task that requires a lot of mental effort.', name: "nfc 16", labels: nfc_scale, required: true},
        {prompt: "It's enough for me that something gets the job done; I don't care how or why it works.", name: "nfc 17", labels: nfc_scale, required: true},
        {prompt: 'I usually end up deliberating about issues even when they do not affect me personally.', name: "nfc 18", labels: nfc_scale, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
};

var shaps = {
    type: 'survey-likert',
    preamble: "<div>For each item, indicate how much you agree or disagree with what the item says.<br>" +
        "Please be as accurate and honest as you can be. Respond to each item as if it were the<br>" +
        "only item. That is, don't worry about being \"consistent\" in your responses.",
    questions: [
        {prompt: 'I would enjoy my favorite television or radio program.', name: "shaps 1", labels: shaps_scale, required: true},
        {prompt: 'I would enjoy being with family or close friends.', name: "shaps 2",  labels: shaps_scale, required: true},
        {prompt: 'I would find pleasure in my hobbies and pastimes.', name: "shaps 3",labels: shaps_scale, required: true},
        {prompt: 'I would be able to enjoy my favorite meal.', name: "shaps 4", labels: shaps_scale, required: true},
        {prompt: 'I would enjoy a warm bath or refreshing shower.', name: "shaps 5", labels: shaps_scale, required: true},
        {prompt: 'I would find pleasure in the scent of flowers or the smell of a fresh sea breeze or freshly baked bread.', name: "shaps 6", labels: shaps_scale, required: true},
        {prompt: "I would enjoy seeing other people's smiling faces.", name: "shaps 7", labels: shaps_scale, required: true},
        {prompt: 'I would enjoy looking smart when I have made an effort with my appearance.', name: "shaps 8", labels: shaps_scale, required: true},
        {prompt: 'I would enjoy reading a book, magazine or newspaper.', name: "shaps 9", labels: shaps_scale, required: true},
        {prompt: 'I would enjoy a cup of tea or coffee or my favorite drink.', name: "shaps 10", labels: shaps_scale, required: true},
        {prompt: 'I would find pleasure in small things; e.g., bright sunny day, a telephone call from a friend.', name: "shaps 11", labels: shaps_scale, required: true},
        {prompt: 'I would be able to enjoy a beautiful landscape or view.', name: "shaps 12", labels: shaps_scale, required: true},
        {prompt: 'I would get pleasure from helping others.', name: "shaps 13", labels: shaps_scale, required: true},
        {prompt: 'I would feel pleasure when I receive praise from other people.', name: "shaps 14", labels: shaps_scale, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var nfc = {
    type: 'survey-likert',
    preamble: "<div>For each of the statements below, please indicate to what extent the statement is characteristic of you.<br>" +
        'If the statement is extremely uncharacteristic of you (not at all like you) please select "extremely uncharacteristic;"<br>' +
        'if the statement is extremely characteristic of you (very much like you) please select "extremely characteristic".<br>' +
        'Of course, a statement may be neither extremely uncharacteristic nor extremely characteristic of you;<br>' +
        'if so, please use the number in the middle of the scale ("uncertain") that describes the best fit.<br>',
    questions: [
        {prompt: 'I would prefer complex to simple problems.', name: "ncf 1", labels: nfc_scale, required: true},
        {prompt: 'I like to have the responsibility of handling a situation that requires a lot of thinking.', name: "nfc 2",  labels: nfc_scale, required: true},
        {prompt: 'Thinking is not my idea of fun.', name: "nfc 3", labels: nfc_scale, required: true},
        {prompt: 'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.', name: "nfc 4", labels: nfc_scale, required: true},
        {prompt: 'I try to anticipate and avoid situations where there is a likely chance I will have to think in depth about something.', name: "nfc 5", labels: nfc_scale, required: true},
        {prompt: 'I find satisfaction in deliberating hard and for long hours.', name: "nfc 6", labels: nfc_scale, required: true},
        {prompt: 'I only think as hard as I have to.', name: "nfc 7", labels: nfc_scale, required: true},
        {prompt: 'I prefer to think about small daily projects to long term ones.', name: "nfc 8", labels: nfc_scale, required: true},
        {prompt: 'I like tasks that require little thought once I\'ve learned them.', name: "nfc 9", labels: nfc_scale, required: true},
        {prompt: 'The idea of relying on thought to make my way to the top appeals to me.', name: "nfc 10", labels: nfc_scale, required: true},
        {prompt: 'I really enjoy a task that involves coming up with new solutions to problems.', name: "nfc 11", labels: nfc_scale, required: true},
        {prompt: 'Learning new ways to think doesn\'t excite me very much.', name: "nfc 12", labels: nfc_scale, required: true},
        {prompt: 'I prefer my life to be filled with puzzles I must solve.', name: "nfc 13", labels: nfc_scale, required: true},
        {prompt: 'The notion of thinking abstractly is appealing to me.', name: "nfc 14", labels: nfc_scale, required: true},
        {prompt: 'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.', name: "nfc 15", labels: nfc_scale, required: true},
        {prompt: 'I feel relief rather than satisfaction after completing a task that requires a lot of mental effort.', name: "nfc 16", labels: nfc_scale, required: true},
        {prompt: 'It\'s enough for me that something gets the job done; I don\'t care how or why it works.', name: "nfc 17", labels: nfc_scale, required: true},
        {prompt: 'I usually end up deliberating about issues even when they do not affect me personally.', name: "nfc 18", labels: nfc_scale, required: true},
    ] 
};

var ami = {
    type: 'survey-likert',
    preamble: "Below are a number of statements. Each statement asks you to think about your life over the <span style='color:red'>last 2 weeks</span>." +
        "For each statement, select how appropriately it describes your life right now. Select \"Completely true\" if the" +
        "statement describes you perfectly, \"Completely untrue\" if the statement does not describe you at all over the" +
        "last 2 weeks, and use the answers in between accordingly.",
    questions: [
        {prompt: "I feel sad or upset when I hear bad news.", name: "ami 1", labels: ami_scale, required: true},
        {prompt: "I start conversations with random people.", name: "ami 2", labels: ami_scale, required: true},
        {prompt: "I enjoy doing things with people I have just met", name: "ami 3", labels: ami_scale, required: true},
        {prompt: "I suggest activities for me and my friends to do.", name: "ami 4", labels: ami_scale, required: true},
        {prompt: "I make decisions firmly and without hesitation", name: "ami 5", labels: ami_scale, required: true},
        {prompt: "After making a decision, I\'ll wonder if I have made the wrong choice.", name: "ami 6", labels: ami_scale, required: true},
        {prompt: "Based on the last two weeks, I\'d say I care deeply about how my loved ones think of me.", name: "ami 7", labels: ami_scale, required: true},
        {prompt: "I go out with my friends on a weekly basis", name: "ami 8", labels: ami_scale, required: true},
        {prompt: "When I decide to do something, I am able to make an effort easily.", name: "ami 9", labels: ami_scale, required: true},
        {prompt: "I don't like to laze around.", name: "ami 10", labels: ami_scale, required: true},
        {prompt: "I get things done when they need to be done, without requiring reminders from others.", name: "ami 11", labels: ami_scale, required: true},
        {prompt: "When I decide to do something, I\'m motivated to see it through to the end.", name: "ami 12", labels: ami_scale, required: true},
        {prompt: "I feel awful if I say something insensitive", name: "ami 13", labels: ami_scale, required: true},
        {prompt: "I start conversations without being prompted", name: "ami 14", labels: ami_scale, required: true},
        {prompt: "When I have something I need to do, I do it straightaway so it is out of the way.", name: "ami 15", labels: ami_scale, required: true},
        {prompt: "I feel bad when I hear an acquaintance has an accident or illness.", name: "ami 16", labels: ami_scale, required: true},
        {prompt: "I enjoy choosing what to do from a range of activities.", name: "ami 17", labels: ami_scale, required: true},
        {prompt: "If I realize I have been unpleasant to someone, I will feel terribly guilty afterwards.", name: "ami 18", labels: ami_scale, required: true},
    ],
};

var phq9 = {
    type: 'survey-likert',
    preamble: '<div>Over the <b>last 2 weeks</b>, how often have you been bothered by any of the following problems?<br>',
    questions: [
        {prompt: 'Little interest or pleasure in doing things', name: "phq9 1", labels: phq9_gad7_scale, required: true},
        {prompt: 'Feeling down, depressed, or hopeless', name: "phq9 2",  labels: phq9_gad7_scale, required: true},
        {prompt: 'Trouble falling or staying asleep, or sleeping too much', name: "phq9 3", labels: phq9_gad7_scale, required: true},
        {prompt: 'Feeling tired or having little energy', name: "phq9 4", labels: phq9_gad7_scale, required: true},
        {prompt: 'Poor appetite or overeating', name: "phq9 5", labels: phq9_gad7_scale, required: true},
        {prompt: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down', name: "phq9 6", labels: phq9_gad7_scale, required: true},
        {prompt: 'Trouble concentrating on things, such as reading the newspaper or watching television', name: "phq9 7", labels: phq9_gad7_scale, required: true},
        {prompt: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual.', name: "phq9 8", labels: phq9_gad7_scale, required: true},
        {prompt: 'Thoughts that you would be better off dead, or of hurting yourself', name: "phq9 9", labels: phq9_gad7_scale, required: true},
        {prompt: '<hr>If you checked off <b>any problems</b>, how <b>difficult</b> have these problems made it for you to do your work, take care of things at home, or get along with other people?', name: "phq9_impact", labels: phq9_impact_options, required: true}
    ] 
};

var dst_strategies = {
    type: 'survey-text',
    preamble: "<div><b><center>Batch Choice Game Strategies</center></b>" ,
    questions: [
        {prompt: 'In the Batch Choice Game, how did you decide which option you preferred to complete?', name: "dst_strategies 1", rows: 7, columns: 80, required: true},
        {prompt: 'What strategies did you use in the Oddball Number Task?', name: "dst_strategies 2", rows: 7, columns: 80, required: true},
        {prompt: 'What strategies did you use in the Batch Choice Game?', name: "dst_strategies 3", rows: 7, columns: 80, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var dst_effort = {
    type: 'survey-likert',
    preamble: "<div><b>Game Effort Ratings</b>" ,
    questions: [
        {prompt: 'How effortful did you find responding to the matching trials?', name: "dst_effort 1", labels: dst_effort_scale, required: true},
        {prompt: 'How effortful did you find responding to the mismatching trials?', name: "dst_effort 2",  labels: dst_effort_scale, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var dst_enjoyment = {
    type: 'survey-likert',
    preamble: "<div><b>Game Enjoyment Ratings</b>" ,
    questions: [
        {prompt: 'How enjoyable did you find responding to the matching trials?', name: "dst_enjoyment 1", labels: dst_enjoyment_scale, required: true},
        {prompt: 'How enjoyable did you find responding to the mismatching trials?', name: "dst_enjoyment 2",  labels: dst_enjoyment_scale, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var dst_trials_preference = {
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> Between the matching trials or mismatching trials which task did you prefer doing? </b>",
     name: "dst_trials_preference", options: dst_trials_preference_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var dst_avoid = {
    type: 'survey-text',
    questions: [
        {prompt: 'How many trials of your preferred task would you complete to avoid one trial of your less preferred task?', name: "dst_avoid", rows: 1, columns: 30, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var dst_boring = {
    type: 'survey-likert',
    preamble: "<div><b>Batch Option Game Bored Ratings</b>" ,
    questions: [
        {prompt: 'How boring did you find the matching trials?', name: "var dst_boring 1", labels: dst_boring_options, required: true},
        {prompt: 'How boring did you find the mismatching trials?', name: "dst_boring 2",  labels: dst_boring_options, required: true},
        {prompt: 'How boring did you find sitting with the blank screen when you chose the option with fewer trials?', name: "dst_boring 3",  labels: dst_boring_options, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    } 
};

var sex_biological = {
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "Biological Sex", 
     name: "sex_biological", options: sex_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var age = {
    type: 'survey-text',
    preamble: "<div><b>Please fill out the following information about yourself. <br>" +
    'If you do not wish to answer, write: "Prefer not to answer"</b><br>' ,
    questions: [
        {prompt: 'Age (years)', name: "age", rows: 1, columns: 30, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
};

var handedness ={
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "Overall handedness", 
     name: "handedness", options: handedness_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var race = {
    type: 'survey-multi-select',
    questions: [
      {prompt: "<b> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b>' +
        "<p> <p> <br>" +
        "Please check any of the following racial categories that apply to you:", 
        name:  "race_category", options: race_options, horizontal: false, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
};

var hispanic_latino ={
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "Are you Hispanic or Latino?", 
     name: "hispanic_latino", options: hispanic_latino_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var income_level_childhood ={
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "What was the income level of your immediate family during your childhood?", 
     name: "income_level_childhood", options: income_level_childhood_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var income_level_now ={
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "What was your total household income before taxes during the past 12 months? (If you are a dependent please use your parents' income)</b>", 
     name: "income_level_now", options: income_level_now_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var student ={
    type: 'survey-multi-choice',
    questions: [
        {prompt: "<b> <center> Please fill out the following information about yourself. <br>" +
        'If you do not wish to answer, select: "Prefer not to answer"<br> </b> </center>' +
        "<p> <p> <br>" +
     "Are you currently a student?</b>", 
     name: "student", options: student_options, required: true}, 
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
}

var demographics_parent_edu = {
    type: 'survey-likert',
    preamble: "<div> <b>Please fill out the following information about your education, your educational goals, and your parents' education <br>" +
    'If you do not wish to answer, select: "Prefer not to answer"</b>',
    questions: [
        {prompt: 'Today I have completed', name: "family_edu 1",  labels: demographics_edu_options, required: true},
        {prompt: 'I would like to complete', name: "family_edu 2",  labels: demographics_edu_options, required: true},
        {prompt: 'My father has completed', name: "family_edu 3",  labels: demographics_edu_options, required: true},
        {prompt: 'My mother has completed', name: "family_edu 3",  labels: demographics_edu_options, required: true},
    ],
    on_finish: function(data) {
        data.phase = "survey"
    }
};


var survey = [];
survey.push(nfc);
survey.push(ami);
survey.push(phq9);
survey.push(shaps);
survey.push(dst_strategies);
survey.push(dst_effort);
survey.push(dst_enjoyment);
survey.push(dst_trials_preference); 
survey.push(dst_avoid); 
survey.push(dst_boring); 
survey.push(sex_biological);
survey.push(age);
survey.push(handedness);
survey.push(race);
survey.push(hispanic_latino)
survey.push(income_level_childhood)
survey.push(income_level_now)
survey.push(student)
survey.push(demographics_parent_edu);