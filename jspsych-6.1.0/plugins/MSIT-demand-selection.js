/*
 * Example plugin template
 */

jsPsych.plugins["MSIT-demand-selection"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "MSIT-demand-selection",
    parameters: {
      is_practice: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: undefined,
        description: 'true = practice',
      },
      n_demand_trials: {
        type: jsPsych.plugins.parameterType.INT,
        default: null,
        description: 'number of demand selection trials to call',
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'fixation time (same as total trial time if no response) in ms; how long the trial (choice) is shown',
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var is_practice = trial.is_practice;
    var n_demand_trials = trial.n_demand_trials; // number of distinct trials to show
    var n_demand_selection_trials_performed = 0; // to keep track of repetitions of the array...
    var n_total_demand_selection_trials_performed = 0; // ...and for the overall task
    var is_missed = true; // whether or not a key was pressed
    var trial_duration = trial.fixation_duration; 
    const n_repeats_demand_selection = 2; // # of times to repeat set of demand selection choices

    // set up match/mismatch combinations for demand selection
    n_mismatch = [1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,12];
    n_match = [5,8,10,13,3,6,8,10,14,2,3,6,9,12,13,15,11,12,16,5,10,9,16,12,14,16,12,16,6,15,10,16,8];
    const n_total_demand_choices = n_mismatch.length;
    var demand_selection_choices = [];
    for (var i = 0; i < n_total_demand_choices; i++) {
      demand_selection_choices.push({match: n_match[i], mismatch: n_mismatch[i]});
    }
    var shuffled_choices = jsPsych.randomization.sampleWithoutReplacement(demand_selection_choices, n_demand_trials);
  
    // create promise that can be resolved externally 
    var outside_resolve;
    var external_promise = function(){
      return new Promise(function(resolve) { 
        outside_resolve = resolve;
      });
    } // end external_prommise

    // timeout to call if key is NOT pressed before max trial time reached; resolves external_promise and clears display
    var timeout = function(ms) {
      jsPsych.pluginAPI.setTimeout(function(){
        // clear the display
        display_element.innerHTML = '';
        outside_resolve();
      }, ms);
    } // end timeout


    //// Demand Selection Set-up ////
    var match_side = 'right';
    var mismatch_side = 'left';
    var current_n_matches = 0;
    var current_n_mismatches = 0;

    // call response function when choice made for demand selection made
    var demand_selection_response = function(info) {
      // kill keyboard listener and timeout
      jsPsych.pluginAPI.clearAllTimeouts();
      jsPsych.pluginAPI.cancelKeyboardResponse(demand_selection_keyboardListener);

      // clear the display
      display_element.innerHTML = '';

      response = info;
      demand_choice = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key),
      is_missed = false;
      
      // set and write data
      var data = {
        phase: 'demand selection',
        is_practice: is_practice,
        trial_duration: trial_duration,
        rt: response.rt,
        key_press: demand_choice,
        is_missed: is_missed,
        n_matches: current_n_matches,
        n_mismatches: current_n_mismatches,
        match_screen_side: match_side,
        mismatch_screen_side: mismatch_side,
        demand_selection_trials_performed: n_total_demand_selection_trials_performed,
      }
      jsPsych.data.write(data);

      outside_resolve();
    } // end demand_selection_response

  
    
    // Show prompt to ask for choice of MSIT trial
    var show_demand_selection = async function() {
      // clear the display
      display_element.innerHTML = '';

      var current_choice = shuffled_choices[n_demand_selection_trials_performed];
      current_n_matches = current_choice['match'];
      current_n_mismatches = current_choice['mismatch'];
      
      var demand_trial_html = "";
      
      // fixation cross
      var fixation_cross = "<div class = 'fixation-trial' style='position: absolute; text-align: center; top:50%; left:50%'>+</div>";
      
      // decide randomly which side of the screen each choice will be on
      if(Math.random() < 0.5) {
        match_side = 'right';
        mismatch_side = 'left';
        // choice on LHS of screen
        demand_trial_html += "<div class ='left-demand-selection'><span class = 'left-demand-selection-text'>" + current_n_mismatches + "<br>" +
          "<span class = 'mismatch'>mismatching</span></span></div>";
        
        // // fixation cross
        demand_trial_html += fixation_cross;

        // // choice on RHS of screen
        demand_trial_html += "<div class = 'right-demand-selection'><span class = 'right-demand-selection-text'>" + current_n_matches + "<br>" +
          "<span class = 'match'>matching</span></span></div>";

      } else {
        match_side = 'left';
        mismatch_side = 'right';

        // choice on LHS of screen
        demand_trial_html += "<div class = 'left-demand-selection'><span class = 'left-demand-selection-text'>" + current_n_matches + "<br>" +
          "<span class = 'match'>matching</span></span></div>";
    
        // // fixation cross
        demand_trial_html += fixation_cross;

        // // choice on RHS of screen
        demand_trial_html += "<div class = 'right-demand-selection'><span class = 'left-demand-selection-text'>" + current_n_mismatches + "<br>" +
          "<span class = 'mismatch'>mismatching</span></span></div>";

      }

      // <- and -> at bottom of screen 
      demand_trial_html += "<span class = 'left-arrow'>&#8592;</span>";
      demand_trial_html += "<span class = 'right-arrow'>&#8594;</span>";
      
      
      // show demand selection task and hide when max trial time reached
      display_element.innerHTML = demand_trial_html;
      timeout(trial_duration);
      
      // increment # of trials performed
      n_demand_selection_trials_performed++;
      n_total_demand_selection_trials_performed++;

      // set up keyboard listener
      is_missed = true; // before any keys pressed
      demand_selection_keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: demand_selection_response, 
        valid_responses: [37,39],  // left and right arrow keys
        rt_method: 'performance', 
        persist: false,
        allow_held_key: false
      })
      
      await external_promise();

      // if no key is pressed
      if (is_missed) {
        var data = {
          phase: 'demand selection',
          is_practice: is_practice,
          trial_duration: trial_duration,
          rt: null,
          key_press: null,
          is_missed: is_missed,
          match_screen_side: match_side,
          mismatch_screen_side: mismatch_side,
          n_matches: current_n_matches,
          n_mismatches: current_n_mismatches,
          demand_selection_trials_performed: n_total_demand_selection_trials_performed,
        }
        jsPsych.data.write(data);
      }

    } // end show_demand_selection

    // call demand selection choices for given number of times
    var demand_selection_sequence = async function(){
      for (var i = 0; i < n_repeats_demand_selection; i++) {
        // demand selection choices -- shuffle again
        shuffled_choices = jsPsych.randomization.shuffle(shuffled_choices);

        // reset # trials performed
        n_demand_selection_trials_performed = 0;
      
        for (var j = 0; j < n_demand_trials; j++) {
          await show_demand_selection();
        }
      }
      end_trial();
    } // end demand_selection_sequence
    

    // function to end trial when it is time
    var end_trial = function() {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    }; // end end_trial

    // Run demand selection trials
    demand_selection_sequence();
  };

  return plugin;
})();
