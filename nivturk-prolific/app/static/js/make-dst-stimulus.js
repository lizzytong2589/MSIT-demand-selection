// function to make demand selection stimulus
var make_dst_stimulus = function() {
    var current_choice = shuffled_choices[dst_index];
    current_n_matches = current_choice['matching'];
    current_n_mismatches = current_choice['mismatching'];

    var n_extra_trials = 0;
    if (current_n_matches > current_n_mismatches) {
      n_extra_trials = current_n_matches - current_n_mismatches;
    }

    // fixation cross
    var fixation_cross = '<div class="col fixation-trial">+</div>';

    // arrows
    var left_arrow = "<span class = 'arrow-key-container'><</span>";
    var right_arrow = "<span class = 'arrow-key-container'>></span>";
    var arrows = "<div class = 'row'><div class = 'col'>" + left_arrow + 
        "</div><div class = 'col'></div><div class = 'col'>" + right_arrow + "</div></div>";

    
    var demand_trial_html = "";
    demand_trial_html += "<div data-style = 'display:flex' class = 'dst-container'>";
    if(jsPsych.data.get().last(1).values()[0]['is_missed']) {
      demand_trial_html += "<div class = 'row' style = 'font-size: 6.5vmin; line-height: 2;'>Too slow...</div>";
    } else {
      demand_trial_html += "<div class = 'row'></div>";
    }
    
    // decide which side of the screen each choice will be on
    if(left_or_right[dst_index] == 0) {
      match_side = 'right';
      mismatch_side = 'left';
      
      //// choice on LHS of screen
      demand_trial_html += "<div class = 'row'>";

      // change box color if choice already made
      if(demand_choice == 'leftarrow' || default_side == 'left') {
        demand_trial_html += "<div class ='demand-selection-choice-box col' style = 'border-color: #00a645'>";
      } else {
        demand_trial_html += "<div class ='demand-selection-choice-box col'>";
      }

      // handle case when more mismatch trials offered than match trials
      if (n_extra_trials != 0) {
        if (match_or_mismatch_first <= 0.5) {
          // extra matching first and mismatching second
          demand_trial_html += "<p>" + n_extra_trials + "<span class = 'match'> matching</span>";
          demand_trial_html += "<br>&<br><br>";
          demand_trial_html += current_n_mismatches + "<span class = 'mismatch'> mismatching</span></p></div>";        
         } 
         else {
          // mismatching first and extra matching second
          demand_trial_html += "<p>" + current_n_mismatches + "<span class = 'mismatch'> mismatching</span>";
          demand_trial_html += "<br>&<br><br>";
          demand_trial_html += n_extra_trials + "<span class = 'match'> matching</span></p></div>";
        }
      } 
      else { 
         // more matching than mismatching or equal number of each trial offered
        demand_trial_html += "<p>" + current_n_mismatches + "<span class = 'mismatch'> mismatching</span></p></div>";
      }
      demand_trial_html += fixation_cross;

      //// choice on RHS of screen
      // change box color if choice already made
      if(demand_choice == 'rightarrow' || default_side == 'right') {
        demand_trial_html += "<div class ='demand-selection-choice-box col' style = 'border-color: #00a645'>";
      } else {
        demand_trial_html += "<div class ='demand-selection-choice-box col'>";
      }

      if (n_extra_trials != 0) {
        demand_trial_html += "<br><br><p>" + current_n_matches + "<span class = 'match'> matching</span><br><br><br></p>";
        demand_trial_html += "</div></div>";
      } 
      else {
        demand_trial_html += "<p>" + current_n_matches + "<span class = 'match'> matching</span></p></div></div>";
      }
    }

    else if(left_or_right[dst_index] == 1){
      // other option for left/right order 
      match_side = 'left';
      mismatch_side = 'right';

      //// choice on LHS of screen
      demand_trial_html += "<div class = 'row'>";

      // change box color if choice already made
      if(demand_choice == 'leftarrow' || default_side == 'left') {
        demand_trial_html += "<div class ='demand-selection-choice-box col' style = 'border-color: #00a645'>";
      } else {
        demand_trial_html += "<div class ='demand-selection-choice-box col'>";
      }

      if (n_extra_trials != 0) {
        demand_trial_html += "<p><br><br>" + current_n_matches + "<span class = 'match'> matching</span><br><br><br></p>";
        demand_trial_html += "</div>";
      } 
      else {
        demand_trial_html += "<p>" + current_n_matches + "<span class = 'match'> matching</span></p></div>";
      }

      demand_trial_html += fixation_cross;
      
      //// choice on RHS of screen
      // change box color if choice already made
      if(demand_choice == 'rightarrow' || default_side == 'right') {
        demand_trial_html += "<div class ='demand-selection-choice-box col' style = 'border-color: #00a645'>";
      } else {
        demand_trial_html += "<div class ='demand-selection-choice-box col'>";
      }

      // handle case when more mismatch trials offered than match trials
      if (n_extra_trials != 0) {
        // extra matching first and mismatching second
        if (match_or_mismatch_first <= 0.5) {
          demand_trial_html += "<p>" + n_extra_trials + "<span class = 'match'> matching</span>";
          demand_trial_html += "<br>&<br><br>";
          demand_trial_html += current_n_mismatches + "<span class = 'mismatch'> mismatching</span></p></div></div>";
         } 
         else {
          // mismatching first and extra matching second
          demand_trial_html += "<p>" + current_n_mismatches + "<span class = 'mismatch'> mismatching</span>";
          demand_trial_html += "<br>&<br><br>";
          demand_trial_html += n_extra_trials + "<span class = 'match'> matching</span></p></div></div>";
        }
      } 
      else {
        // more mismatching than matching trials or same number of matching and mismatching
        demand_trial_html += "<p>" + current_n_mismatches + "<span class = 'mismatch'> mismatching</span></p></div></div>";
      }
    }

    // add left/right arrows under choices and close div for container
    demand_trial_html += arrows + "</div>";

    // console.table({'match_or_mismatch_first':match_or_mismatch_first,'n_extra_trials':n_extra_trials,'current_n_matches':current_n_matches, 'current_n_mismatches':current_n_mismatches});
    return demand_trial_html;
};