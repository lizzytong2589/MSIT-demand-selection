// for two-stim choice add parameter for whether to limit choice time.
var instruction_pagelinks_a = ['Stimuli/MSIT_instructions/Slide1.jpeg',
                            'Stimuli/MSIT_instructions/Slide2.jpeg',
                            'Stimuli/MSIT_instructions/Slide3.jpeg',
                            'Stimuli/MSIT_instructions/Slide4.jpeg',
                            'Stimuli/MSIT_instructions/Slide5.jpeg',
                            'Stimuli/MSIT_instructions/Slide6.jpeg'];

// var instruction_pagelinks_b = ['Stimuli/MSIT_instructions/Slide7.JPG'];

var pages_a = [];
for (var i = 0; i < instruction_pagelinks_a.length; i++){
    pages_a.push('<img src= "'+ instruction_pagelinks_a[i] +  '" alt = "" >')
}

var instruction_pages_a = {
    type: 'instructions',
    pages: pages_a,
    show_clickable_nav: true
}

var instructions = [];
instructions.push(instruction_pages_a);

