jsPsych.plugins["MSIT"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "MSIT",
    description: "creates a Multi-Source Interference Task",
    parameters: {
      is_practice: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: undefined,
        description: 'true = practice',
      },
      n_MSIT_tasks: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'number of MSIT tasks to perform',
      },
      MSIT_task_duration: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: undefined,
        description: 'time MSIT stimulus is shown in ms for if no key is pressed',
      },
      MSIT_task_type: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: 'control, congruent, or incongruent',
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'fixation time in ms',
      },
      demand_selection: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: 'whether or not to include demand selection (true = yes; false = no)',
      },
    }
  }


  plugin.trial = function(display_element, trial) {
    // stimuli for each test: task (symbols), task_type(control, incongruent, congruent), correct_response(1,2,3)
    var symbols = ['1', '2', '3'];
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

    // counters and parameters 
    var is_practice = trial.is_practice;
    var demand_selection = trial.demand_selection;
    var n_MSIT_tasks = trial.n_MSIT_tasks;
    var n_MSIT_tasks_performed = 0; // number of MSIT tasks performed in one travel period
    var MSIT_task_duration = trial.MSIT_task_duration;
    var fixation_duration = trial.fixation_duration;
    var MSIT_task_type = trial.MSIT_task_type;
    var is_missed = false;

    // create promise that can be resolved externally 
    var outside_resolve;
    var external_promise = function(){
      return new Promise(function(resolve) { 
        outside_resolve = resolve;
      });
    } // end external_prommise

    // call when choice made for demand selection
    var choice_response = function(info) {
      // kill keyboard listener
      jsPsych.pluginAPI.cancelKeyboardResponse(choice_keyboardListener);
      
      response = info;

      // check choice and set task type
      if(jsPsych.pluginAPI.compareKeys('1', response.key)){
        MSIT_task_type = 'congruent';
      } else if(jsPsych.pluginAPI.compareKeys('3', response.key)) {
        MSIT_task_type = 'incongruent';
      }
      
      // set and write data
      var data = {
        phase: 'Demand Selection',
        is_practice: is_practice,
        task_type: null,
        task_duration: null,
        fixation_duration: null,
        stimulus: null,
        rt: response.rt,
        key_press: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key),
        correct_response: null,
        correct: null,
        is_missed: null,
        MSIT_tasks_performed: null,
      }
      jsPsych.data.write(data);

      // console.log(MSIT_task_type)
      outside_resolve();
    } // end choice_response

    // Show prompt to ask for choice of task if there is demand selection
    var choice = async function() {
      // ask user for choice
      display_element.innerHTML = "<p>Press 1 to choose <span style ='color:blue'>matching</span> " +
        "and 3 to choose <span style ='color:orange'>mismatching</span> tasks.</p>"
      
      // set up keyboard listener
      choice_keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: choice_response, 
        valid_responses: ['1','3'], 
        rt_method: 'performance', 
        persist: false,
        allow_held_key: false
      })
      
      await external_promise();
    } // end choice()


    // promisify timeout function
    var timeout = function(ms, id) {
      return new Promise(resolve => jsPsych.pluginAPI.setTimeout(function(){
        display_element.querySelector(id).style.visibility = 'hidden';
        resolve();
      }, ms));
    } // end timeout

    // draw fixation cross
    var draw_fixation_cross = async function(){
      var fixation_cross = '<div class="fixation-task" id="fixation-cross">'+'+'+'</div>';

      // show fixation cross
      display_element.innerHTML = fixation_cross;

      // finish after set time
      await timeout(fixation_duration, '#fixation-cross');

    }; // end draw_fixation_cross


    // MSIT task creation
    var current_MSIT_task = {};

    // call if key pressed during MSIT task (function below)
    var MSIT_response = async function(info){ 
      // kill keyboard listener and timeout
      jsPsych.pluginAPI.clearAllTimeouts();
      jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

      response = info;
      var correct = false;
      is_missed = false;
      var key_pressed = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
      var correct_response = current_MSIT_task[0]['correct_response'];
      
      if(key_pressed == correct_response) {
        correct = true;
      }

      var data = {
        phase: 'MSIT',
        is_practice: is_practice,
        task_type: current_MSIT_task[0]['task_type'],
        task_duration: MSIT_task_duration,
        fixation_duration: fixation_duration,
        stimulus: current_MSIT_task[0]['task'],
        rt: response.rt,
        key_press: key_pressed,
        correct_response: correct_response,
        correct: correct,
        is_missed: is_missed,
        MSIT_tasks_performed: n_MSIT_tasks_performed,
      }
      jsPsych.data.write(data);
      
      // hide task; resolve promise for show_MSIT_task()
      outside_resolve();

    } // end MSIT_response

    // function to create one MSIT task
    var show_MSIT_task = async function() {
      n_MSIT_tasks_performed++;
      if (MSIT_task_type == 'control') {
        current_MSIT_task = jsPsych.randomization.sampleWithReplacement(control, 1);
      } else if (MSIT_task_type == 'congruent') {
        current_MSIT_task = jsPsych.randomization.sampleWithReplacement(congruent, 1);
      } else if (MSIT_task_type == 'incongruent') {
        current_MSIT_task = jsPsych.randomization.sampleWithReplacement(incongruent, 1);
      }
      
      var task = current_MSIT_task[0]['task'];
      var MSIT_stimulus = '<div class = "MSIT-task" id="MSIT-stimulus">' + task +'</div>';

      // show stimulus
      display_element.innerHTML = MSIT_stimulus;

      // clear MSIT task after set time if no response
      jsPsych.pluginAPI.setTimeout(function() {
        // display_element.querySelector('#MSIT-stimulus').style.visibility = 'hidden';
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        outside_resolve();
      }, MSIT_task_duration);

      is_missed = true; // before any keys pressed
      keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: MSIT_response, 
        valid_responses: symbols, 
        rt_method: 'performance', 
        persist: false,
        allow_held_key: false
      })
      
      await external_promise()

      // if no key is pressed
      if (is_missed) {
        var data = {
          phase: 'MSIT',
          is_practice: is_practice,
          task_type: current_MSIT_task[0]['task_type'],
          task_duration: MSIT_task_duration,
          fixation_duration: fixation_duration,
          stimulus: current_MSIT_task[0]['task'],
          rt: null,
          key_press: null,
          correct_response: current_MSIT_task[0]['correct_response'],
          correct: null,
          is_missed: is_missed,
          MSIT_tasks_performed: n_MSIT_tasks_performed,
        }
        jsPsych.data.write(data);
      }
    } // end show_MSIT_task
  

    // create desired number of MSIT tasks 
    var MSIT_task_sequence = async function() {
      n_MSIT_tasks_performed = 0;

      // if demand_selection task, determine task choice
      if(demand_selection) {
        await choice();
      } 

      // run MSIT trials
      for (var i = 0; i < n_MSIT_tasks; i++) {
        await draw_fixation_cross();
        await show_MSIT_task();
      }
      end_trial();
    }

    // function to end trial when it is time
    var end_trial = function() {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        fixation_duration: fixation_duration,
        MSIT_task_duration: MSIT_task_duration,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    };
    
    // run task sequence
    MSIT_task_sequence();

  };

  return plugin;
})();
