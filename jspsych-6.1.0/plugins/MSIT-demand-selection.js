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
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        description: 'fixation time (same as total trial time if no response) in ms; how long the trial (choice) is shown',
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var is_practice = trial.is_practice;
    var n_demand_trials = trial.n_demand_trials; 
    var trial_duration = trial.trial_duration; 
    var dst_index = 0; // # of trials run
    var is_missed = true; // whether or not a key was pressed
    var match_side;
    var mismatch_side;
    var current_n_matches;
    var current_n_mismatches;
    
    // set up match/mismatch combinations for demand selection
    n_mismatch = [1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,12];
    n_match = [5,8,10,13,3,6,8,10,14,2,3,6,9,12,13,15,11,12,16,5,10,9,16,12,14,16,12,16,6,15,10,16,8];
    const n_total_demand_choices = n_mismatch.length;
    var demand_selection_choices = [];
    for (var i = 0; i < n_total_demand_choices; i++) {
      demand_selection_choices.push({matching: n_match[i], mismatching: n_mismatch[i]});
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
    // array of 0s and 1s to determine side of screen that match/mismatch will be shown on
    var left_or_right = new Array(n_demand_trials);
    left_or_right.fill(0,0,Math.floor(n_demand_trials/2));
    left_or_right.fill(1,Math.floor(n_demand_trials/2), n_demand_trials);
    left_or_right = jsPsych.randomization.shuffle(left_or_right);

    // array of 0s and 1s to determine whether to show MSIT trials or not
    var show_no_show_MSIT = new Array(n_demand_trials);
    show_no_show_MSIT.fill(0,0,Math.floor(n_demand_trials/2));
    show_no_show_MSIT.fill(1,Math.floor(n_demand_trials/2), n_demand_trials);
    show_no_show_MSIT = jsPsych.randomization.shuffle(show_no_show_MSIT);
    

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
        demand_selection_trials_performed: dst_index,
      }
      jsPsych.data.write(data);

      outside_resolve();
    } // end demand_selection_response
  
    
    // Show prompt to ask for choice of MSIT trial
    var show_demand_selection = async function() {
      // clear the display
      display_element.innerHTML = '';

      var current_choice = shuffled_choices[dst_index];
      current_n_matches = current_choice['matching'];
      current_n_mismatches = current_choice['mismatching'];
      
      // fixation cross
      var fixation_cross = "<div class = 'col'><div class = 'fixation-trial'>+</div></div>";

      // arrows
      var left_arrow = "<span class = 'arrow-key-container'><</span>";
      var right_arrow = "<span class = 'arrow-key-container'>></span>";
      var arrows = "<div class = 'row'><div class = 'col'>" + left_arrow + 
          "</div><div class = 'col'></div><div class = 'col'>" + right_arrow + "</div></div>";
      
      var demand_trial_html = "";
      demand_trial_html += "<div class = 'dst-container'>";
      demand_trial_html += "<div class = 'row'></div>";
      
      // decide which side of the screen each choice will be on
      if(left_or_right[dst_index] == 0) {
        match_side = 'right';
        mismatch_side = 'left';
        
        // choice on LHS of screen
        demand_trial_html += "<div class = 'row'>";
        demand_trial_html += "<div class ='demand-selection-choice-box col'><p>" + current_n_mismatches + 
          "<span class = 'mismatch'> mismatching</span></p></div>";
        
        demand_trial_html += fixation_cross;

        // choice on RHS of screen
        demand_trial_html += "<div class = 'demand-selection-choice-box col'><p>" + current_n_matches +
          "<span class = 'match'> matching</span></p></div></div>";
        
      } else if(left_or_right[dst_index] == 1){
        match_side = 'left';
        mismatch_side = 'right';

        // choice on LHS of screen
        demand_trial_html += "<div class = 'row'>";
        demand_trial_html += "<div class ='demand-selection-choice-box col'><p>" + current_n_matches +
          "<span class = 'match'> matching</span></p></div>";

        demand_trial_html += fixation_cross;
        
        // choice on RHS of screen
        demand_trial_html += "<div class = 'demand-selection-choice-box col'><p>" + current_n_mismatches +
          "<span class = 'mismatch'> mismatching</span></p></div></div>";

      }

      // add left/right arrows under choices and close div for container
      demand_trial_html += arrows + "</div>";
      
      // show demand selection task and hide when max trial time reached
      display_element.innerHTML = demand_trial_html;
      timeout(trial_duration);
      
      // increment # of trials performed
      dst_index++;

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
          n_matches: current_n_matches,
          mismatch_screen_side: mismatch_side,
          n_mismatches: current_n_mismatches,
          demand_selection_trials_performed: dst_index,
        }
        jsPsych.data.write(data);
      }

    } // end show_demand_selection

    // call demand selection choices for given number of times
    var demand_selection_sequence = async function(){
      // demand selection choices and match/mismatch screen sides -- shuffle again
      shuffled_choices = jsPsych.randomization.shuffle(shuffled_choices);
      left_or_right = jsPsych.randomization.shuffle(left_or_right); 
    
      for (var j = 0; j < n_demand_trials; j++) {
        await show_demand_selection();
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
