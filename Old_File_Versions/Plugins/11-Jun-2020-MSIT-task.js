// shows one fixation cross then one MSIT task
jsPsych.plugins["MSIT"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "MSIT",
      description: "MSIT task",
      parameters: {
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
      var n_MSIT_tasks = trial.n_MSIT_tasks;
      var n_MSIT_tasks_performed = 0; // number of MSIT tasks performed in one travel period
      var MSIT_task_duration = trial.MSIT_task_duration;
      var fixation_duration = trial.fixation_duration;
      var MSIT_task_type = trial.MSIT_task_type;
      var is_missed = false;
  
      // promisify timeout function
      var timeout = function(ms, id) {
        return new Promise(resolve => jsPsych.pluginAPI.setTimeout(function(){
          display_element.querySelector(id).style.visibility = 'hidden';
          console.log('hide' + id);
          resolve();
        }, ms));
      }
  
      // draw fixation cross
      var draw_fixation_cross = async function(){
        var fixation_cross = '<div class="fixation-task" id="fixation-cross">'+'+'+'</div>';
        console.log('fixation cross');
  
        // show fixation cross
        display_element.innerHTML = fixation_cross;
  
        // save and write data
        var data = {
          phase: 'MSIT',
          task_type: 'fixation',
          task_duration: fixation_duration,
          stimulus: '+',
          rt: 'null',
          key_press: 'null',
        }
        jsPsych.data.write(data);
  
        // finish after set time
        await timeout(fixation_duration, '#fixation-cross');
  
      }; // end draw_fixation_cross
      // draw_fixation_cross();
  
      // MSIT task creation
      var current_MSIT_task = {};
      // call if key pressed during MSIT task
      var MSIT_response = function(info){ 
        console.log('key pressed: MSIT');
  
        // kill keyboard listener and timeout
        jsPsych.pluginAPI.clearAllTimeouts();
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
  
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
          task_type: current_MSIT_task[0]['task_type'],
          task_duration: MSIT_task_duration,
          stimulus: current_MSIT_task[0]['task'],
          rt: response.rt,
          key_press: key_pressed,
          correct_response: correct_response,
          correct: correct,
          is_missed: is_missed,
          MSIT_tasks_performed: n_MSIT_tasks_performed,
        }
        jsPsych.data.write(data);
        end_trial();
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
        console.log(task);
  
        // show stimulus
        display_element.innerHTML = MSIT_stimulus;
  
        is_missed = true; // before any keys pressed
        keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: MSIT_response, 
          valid_responses: symbols, 
          rt_method: 'performance', 
          persist: false,
          allow_held_key: false
        })
  
        // clear MSIT task after set time if no response
        await timeout(MSIT_task_duration, '#MSIT-stimulus');
  
        // if no key is pressed
        if (is_missed) {
          var data = {
            phase: 'MSIT',
            task_type: current_MSIT_task[0]['task_type'],
            task_duration: MSIT_task_duration,
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
        end_trial();
      } // end show_MSIT_task
      // show_MSIT_task();
    
      // create desired number of MSIT tasks 
      var MSIT_task_sequence = async function() {
        n_MSIT_tasks_performed = 0;
        for (var i = 0; i < n_MSIT_tasks; i++) {
          await draw_fixation_cross();
          await show_MSIT_task();
        }
        end_trial();
      }
  
      // MSIT_task_sequence();
  
  
      // function to end trial when it is time
      var end_trial = function() {
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
  
        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
  
        d3.select('svg').remove();
  
        // gather the data to store for the trial
        var trial_data = {
          // round_duration: round_duration,
          fixation_duration: fixation_duration,
          MSIT_task_duration: MSIT_task_duration,
        };
  
        // clear the display
        display_element.innerHTML = '';
  
        // move on to the next trial
        jsPsych.finishTrial();
      };
  
  
      // round timeout
      // total_msec = 60*1000*trial.time_min;
      // wait_for_time(10000, end_trial);
      
  
    };
  
    return plugin;
  })();
  
