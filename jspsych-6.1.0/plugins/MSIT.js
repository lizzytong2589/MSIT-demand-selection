jsPsych.plugins["MSIT"] = (function() {
  var plugin = {};

  plugin.info = {
    name: "MSIT",
    description: "creates a Multi-Source Interference Task",
    parameters: {
      round: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'round number',
      },
      is_practice: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: 'true = practice',
      },
      n_MSIT_trials: {
        type: jsPsych.plugins.parameterType.INT,
        default: 7,
        description: 'number of MSIT trials to perform',
      },
      MSIT_trial_duration: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: 1000,
        description: 'time MSIT stimulus is shown in ms for if no key is pressed',
      },
      MSIT_trial_type: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: 'control, matching, or mismatching',
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 250,
        description: 'fixation time in ms',
      },
      attention_screen: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        description: 'whether or not to include an attention check screen',
      },
    }
  }


  plugin.trial = function(display_element, trial) {
    // stimuli for each test: trial (symbols), trial_type(mismatching, matching), correct_response(1,2,3)
    var symbols = ['1', '2', '3'];
    var matching = [
        {trial: symbols[0] + ' 0 0', trial_type: 'matching', correct_response: '1'},
        {trial: '0 ' + symbols[1] + ' 0', trial_type: 'matching', correct_response: '2'},
        {trial: '0 0 ' + symbols[2], trial_type: 'matching', correct_response: '3'},
    ];
    var mismatching = [
        // trials where answer is 1
        {trial: '2 ' + symbols[0] + ' 2', trial_type: 'mismatching', correct_response: '1'},
        {trial: '3 ' + symbols[0] + ' 3', trial_type: 'mismatching', correct_response: '1'},
        {trial: '2 2 ' + symbols[0], trial_type: 'mismatching', correct_response: '1'},
        {trial: '3 3 ' + symbols[0], trial_type: 'mismatching', correct_response: '1'},

        // trials where answer is 2
        {trial: '1 1 ' + symbols[1], trial_type: 'mismatching', correct_response: '2'},
        {trial: '3 3 ' + symbols[1], trial_type: 'mismatching', correct_response: '2'},
        {trial: symbols[1] + ' 1 1', trial_type: 'mismatching', correct_response: '2'},
        {trial: symbols[1] + ' 3 3', trial_type: 'mismatching', correct_response: '2'},

        // trials where answer is 3
        {trial: symbols[2] + ' 1 1', trial_type: 'mismatching', correct_response: '3'},
        {trial: symbols[2] + ' 2 2', trial_type: 'mismatching', correct_response: '3'},
        {trial: '1 ' + symbols[2] + ' 1', trial_type: 'mismatching', correct_response: '3'},
        {trial: '2 ' + symbols[2] + ' 2', trial_type: 'mismatching', correct_response: '3'},
    ];

    // plugin parameters 
    var round = trial.round;
    var is_practice = trial.is_practice;
    var n_MSIT_trials = trial.n_MSIT_trials;
    var n_MSIT_trials_performed = 0; // number of MSIT trials performed in one travel period
    var MSIT_trial_duration = trial.MSIT_trial_duration;
    var fixation_duration = trial.fixation_duration;
    var MSIT_trial_type = trial.MSIT_trial_type;
    var is_missed = false;
    var attention_screen = trial.attention_screen;
    var consecutive_misses = 0;
    var MSIT_timeout; 

    // create promise that can be resolved externally 
    var outside_resolve;
    var external_promise = function(){
      return new Promise(function(resolve) { 
        outside_resolve = resolve;
      });
    } // end external_prommise

    // promisify timeout function
    var timeout = function(ms) {
      return new Promise(function(resolve) {
          // Set up the timeout
          MSIT_timeout = setTimeout(function() {
              resolve();
          }, ms);
      });
    }

    // draw fixation cross
    var fixation_cross = '<div class="fixation-trial">'+'+'+'</div>';
    var attention_screen_circle = '<div class = "attention-check-circle"></div>';
    var draw_fixation = async function(){
      // clear the display
      display_element.innerHTML = '';

      var fixation = "";

      if (consecutive_misses > 1 && attention_screen) {
        fixation += attention_screen_circle;
      } else {
        fixation += fixation_cross;
      }

      // show fixation 
      display_element.innerHTML = fixation;

      // finish after set time
      await timeout(fixation_duration);

    }; // end draw_fixation


    //// MSIT Trial Set-up ////
    var this_MSIT_trials = [];
    var current_MSIT_trial = {}
    if (trial_type == 'matching') {
      for (var i = 0; i < Math.floor(n_MSIT_trials/matching.length); i++) {
        this_MSIT_trials.push(...jsPsych.randomization.repeat(matching, 1))
      }
        this_MSIT_trials.push(...jsPsych.randomization.sampleWithoutReplacement(matching, n_MSIT_trials%matching.length))
    } else if (trial_type == 'mismatching')  {
      for (var i = 0; i < Math.floor(n_MSIT_trials/mismatching.length); i++) {
        this_MSIT_trials.push(...jsPsych.randomization.repeat(mismatching, 1))
      }
        this_MSIT_trials.push(...jsPsych.randomization.sampleWithoutReplacement(mismatching, n_MSIT_trials%mismatching.length))
    }

    // call if key pressed during MSIT trial (function below)
    var MSIT_response = async function(info){ 
      // kill keyboard listener and timeout
      clearTimeout(MSIT_timeout);
      jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

      response = info;
      var correct = false;
      is_missed = false;
      var key_pressed = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
      var correct_response = current_MSIT_trial['correct_response'];
      
      if(key_pressed == correct_response) {
        correct = true;
      }

      // adjust miss counter accordingly
      if(correct) {
        consecutive_misses = 0;
      } else {
        consecutive_misses++;
      }

      var data = {
        phase: 'MSIT',
        is_practice: is_practice,
        round: round,
        MSIT_trial_type: current_MSIT_trial['trial_type'],
        trial_duration: MSIT_trial_duration,
        fixation_duration: fixation_duration,
        stimulus: current_MSIT_trial['trial'],
        rt: response.rt,
        key_press: key_pressed,
        correct_response: correct_response,
        correct: correct,
        is_missed: is_missed,
        MSIT_trials_performed: n_MSIT_trials_performed,
      }
      jsPsych.data.write(data);
      
      // hide trial; resolve promise for show_MSIT_trial()
      outside_resolve();

    } // end MSIT_response

    // function to create one MSIT trial
    var show_MSIT_trial = async function() {
      n_MSIT_trials_performed++;
      current_MSIT_trial = this_MSIT_trials.pop();
      var trial = current_MSIT_trial['trial'];
      var MSIT_stimulus = '<div class = "MSIT-trial">' + trial +'</div>';

      // show stimulus
      display_element.innerHTML = MSIT_stimulus;

      // clear MSIT trial after set time if no response
      MSIT_timeout = setTimeout(function() {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        outside_resolve();
      }, MSIT_trial_duration);

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
        // increase miss counter
        consecutive_misses++;

        var data = {
          phase: 'MSIT',
          is_practice: is_practice,
          round: round,
          MSIT_trial_type: current_MSIT_trial['trial_type'],
          trial_duration: MSIT_trial_duration,
          fixation_duration: fixation_duration,
          stimulus: current_MSIT_trial['trial'],
          rt: null,
          key_press: null,
          correct_response: current_MSIT_trial['correct_response'],
          correct: null,
          is_missed: is_missed,
          MSIT_trials_performed: n_MSIT_trials_performed,
        }
        jsPsych.data.write(data);
      }
    } // end show_MSIT_trial
  

    // create desired number of MSIT trials 
    var MSIT_trial_sequence = async function() {
      n_MSIT_trials_performed = 0;

      // run MSIT trials
      for (var j = 0; j < n_MSIT_trials; j++) {
        await draw_fixation();
        await show_MSIT_trial();
      }
      end_trial();
    } // end MSIT_trial_sequence

    // function to end trial when it is time
    var end_trial = function() {
      // kill any remaining plugin timeouts
      clearTimeout(MSIT_timeout);

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    }; // end end_trial
    
    // run trial sequence
    MSIT_trial_sequence();

  };

  return plugin;
})();