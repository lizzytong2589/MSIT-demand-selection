/* jspsych-instructions-automatic.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * Page numbers can be displayed to help with navigation by setting show_page_number
 * to true.
 *
 * documentation: docs.jspsych.org
 *
 *
 */
jsPsych.plugins["instructions-automatic"] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'instructions-automatic',
    description: '',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key forward',
        default: 'rightarrow',
        description: 'The key the subject can press in order to advance to the next page.'
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key backward',
        default: 'leftarrow',
        description: 'The key that the subject can press to return to the previous page.'
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow backward',
        default: true,
        description: 'If true, the subject can return to the previous page of the instructions.'
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow keys',
        default: false, //currently overides clicks so set to false 
        description: 'If true, the subject can use keyboard keys to navigate the pages.'
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show clickable nav',
        default: true,
        description: 'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.'
      },
      show_page_number: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Show page number',
          default: false,
          description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label previous',
        default: 'Previous',
        description: 'The text that appears on the button to go backwards.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
      },
      wait_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Wait Time',
        default: 5 * 1000,
        description: 'Amount of time participant must wait before being able to click to next page of instructions.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var current_page = 0;
    var view_history = [];
    var pages_viewed = []; // like view history, but just a list of "current_page" , list of numbers

    var start_time = performance.now();

    var last_page_update_time = start_time;

    function btnListener(evt){
        evt.target.removeEventListener('click', btnListener);
        if(this.id === "jspsych-instructions-back"){
          back();
        }
        else if(this.id === 'jspsych-instructions-next_allowed'){
            next();
        }
    }

    var show_current_page = async function() {
      var html = trial.pages[current_page];
      display_element.innerHTML = html;
      add_current_page_to_view_history()
      //console.log(current_page);
      //console.log(pages_viewed); 
      await timeout(trial.wait_time);
    }

    var next = async function() {
      //setTimeout(function() {
       current_page++;
      //}, trial.wait_time); // delay moving onto "Next" screen by 5 seconds (5 seconds from onset of arrival at current page)

      // if done, finish up...
      if (current_page >= trial.pages.length) {
        endTrial();
      } //else {
        //  setTimeout(function() {
        //    console.log(current_page);
        //    show_current_page();
       //}, trial.wait_time); // delay moving onto "Next" screen by 5 seconds (5 seconds from onset of arrival at current page)
      //}
      await timeout(100);
    }

    function back() {    
    current_page--;
    show_current_page();
    }

    function add_current_page_to_view_history() {
      var current_time = performance.now();
      var page_view_time = current_time - last_page_update_time;

      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time
      });

      pages_viewed.push(current_page);
      last_page_update_time = current_time;
    }

    
    function endTrial() {
      display_element.innerHTML = '';
      var trial_data = {
        "view_history": JSON.stringify(view_history),
        "rt": performance.now() - start_time
      };
      jsPsych.finishTrial(trial_data);
    }

    var timeout = function(ms) {
      return new Promise(function(resolve) {
          // Set up the timeout
          automaticity_timeout = setTimeout(function() {
              resolve();
          }, ms);
      });
    }
    
    var instructions_trial_sequence = async function() {
      current_page = 0;
      // run automaticity trials
      for (var j = 0; j <  (trial.pages.length)-1; j++) { //everything but the ultimate slide, gives errors in other plugins otherwise
          await show_current_page();
          await next();
      }
      await show_current_page(); // handle the last slide here
      endTrial();
    } // end instructions_trial_sequence
    
    
    // run trial sequence
    instructions_trial_sequence();
    
  
  };

  return plugin;
})();

