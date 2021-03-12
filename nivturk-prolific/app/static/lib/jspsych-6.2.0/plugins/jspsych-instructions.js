/* jspsych-instructions.js
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

jsPsych.plugins.instructions = (function() {

  var plugin = {};

  plugin.info = {
    name: 'instructions',
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

    function show_current_page() {
      var html = trial.pages[current_page];

      var pagenum_display = "";
      if(trial.show_page_number) {
          pagenum_display = "<span style='margin: 0 1em;' class='"+
          "jspsych-instructions-pagenum'>Page "+(current_page+1)+"/"+trial.pages.length+"</span>";
      }
    
      if (trial.show_clickable_nav) {

        var nav_html = "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
        if (trial.allow_backward) {
          var allowed = (current_page > 0 )? '' : "disabled='disabled'";
          nav_html += "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' "+allowed+">&lt; "+trial.button_label_previous+"</button>";
        }
        if (trial.pages.length > 1 && trial.show_page_number) {
            nav_html += pagenum_display;
        }

        var allowed_next = (current_page >= 0 )? '' : "disabled='disabled'";
        var disabled_next = "disabled='disabled'";

         nav_html += "<button id='jspsych-instructions-next_allowed' class='jspsych-btn' style='margin-left: 5px;' "+allowed_next+">&gt; "+trial.button_label_next+"</button>";
         nav_html += "<button id='jspsych-instructions-next_disabled' class='jspsych-btn' style='margin-left: 5px;' "+disabled_next+">&gt; "+trial.button_label_next+"</button>";

         html += nav_html;
         display_element.innerHTML = html;

      

        if (current_page != 0 && trial.allow_backward) {
          display_element.querySelector('#jspsych-instructions-back').addEventListener('click', btnListener);
        }
        
        if (pages_viewed.includes(current_page)) { //has this page been seen before?
          display_element.querySelector('#jspsych-instructions-next_allowed').addEventListener('click', btnListener); //if current page is in the view history, no delay
          display_element.querySelector('#jspsych-instructions-next_disabled').style.display = 'none'; //hide disabled next

        } else {  //if current page is not in the view history, delay  
            display_element.querySelector('#jspsych-instructions-next_disabled').addEventListener('click', btnListener); //show disabled next
            display_element.querySelector('#jspsych-instructions-next_allowed').style.display = 'none';  //hide enabled next
        
            setTimeout(function() {
              display_element.querySelector('#jspsych-instructions-next_allowed').style.display = 'initial';  //show enabled next
              display_element.querySelector('#jspsych-instructions-next_allowed').addEventListener('click', btnListener)
              display_element.querySelector('#jspsych-instructions-next_disabled').style.display = 'none'; //hide disabled next
            }, trial.wait_time); // delay moving onto "Next" screen by 5 seconds (5 seconds from onset of arrival at current page)
        }


      } else {
        if (trial.show_page_number && trial.pages.length > 1) {
          // page numbers for non-mouse navigation
          html += "<div class='jspsych-instructions-pagenum'>"+pagenum_display+"</div>"
        } 
        display_element.innerHTML = html;
      }
      //console.log(current_page);
      add_current_page_to_view_history()
      //console.log(pages_viewed); 
    }

    function next() {
      current_page++;
      // if done, finish up...
      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }
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

      if (trial.allow_keys) {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener_next);
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener_back);
      }

      display_element.innerHTML = '';

      var trial_data = {
        "view_history": JSON.stringify(view_history),
        "rt": performance.now() - start_time
      };

      jsPsych.finishTrial(trial_data);
    }

    var after_response_next = function(info) {
      // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long

      //if current page is already in the view history (went back and now returning to already seen page), do not delay
      if (pages_viewed.includes(current_page)) { //has this page been seen before?
        keyboard_listener_next = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response_next,
          valid_responses: [trial.key_forward], // need a visual shading when this is killed
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      
      } else {  //if current page is not in the view history, delay
        setTimeout(function() {
          keyboard_listener_next = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response_next,
            valid_responses: [trial.key_forward], // need a visual shading when this is killed
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
          });
        }, trial.wait_time); // delay moving onto "Next" screen by 5 seconds (5 seconds from onset of arrival at current page)
      }

      // check if key is forwards and update page
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }
    };

    var after_response_back = function(info) { //no wait to go backwards
      // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
      keyboard_listener_back = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response_back,
        valid_responses: [trial.key_backward], 
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      // check if key is  backwards and update page
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0 && trial.allow_backward) {
          back();
        }
      }

    };

    show_current_page();

    if (trial.allow_keys) {
      var keyboard_listener_next = jsPsych.pluginAPI.getKeyboardResponse({ //after_response_next forces you to wait 5 seconds before seeing new slide
        callback_function: after_response_next,
        valid_responses: [trial.key_forward],
        rt_method: 'performance',
        persist: false
      });

      var keyboard_listener_back = jsPsych.pluginAPI.getKeyboardResponse({ //no wait to go backwards
        callback_function: after_response_back,
        valid_responses: [trial.key_backward],
        rt_method: 'performance',
        persist: false
      });
    }
  };

  return plugin;
})();

