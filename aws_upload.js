// AWS Bucket Configurations
var bucketName = 'ncclab-msit-dst';
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:1c3beb63-d785-48a1-b7b7-2d1796d27fa6",
});

var s3 = new AWS.S3({
    apiVersion: '2012-10-17',
    params: {Bucket: bucketName}
});

function aws_upload() {
    //// data getting/saving
    // add subject ID to data

    jsPsych.data.get().addToAll({consent_initials:sessionStorage.getItem('consent_initials'), consent_date:sessionStorage.getItem('consent_date')});
    jsPsych.data.get().addToAll({worker_ID: ID, MTurk_completion_code: completion_code});
    
    var interaction_data = jsPsych.data.getInteractionData();

    // filter data by experiment phase
    var MSIT_data = jsPsych.data.get().filterCustom(function(trial){
        return trial.phase =='MSIT';
    });
    MSIT_data = MSIT_data.ignore('internal_node_id');
    MSIT_data = MSIT_data.ignore('trial_type');
    MSIT_data = MSIT_data.ignore('trial_index');

    var DST_data = jsPsych.data.get().filterCustom(function(trial){
        return trial.phase =='demand selection';
    });
    DST_data = DST_data.ignore('internal_node_id');
    DST_data = DST_data.ignore('trial_type');
    DST_data = DST_data.ignore('trial_index');

    var survey_data = jsPsych.data.get().filterCustom(function(trial){
        return trial.phase =='survey';
    });
    survey_data = survey_data.ignore('internal_node_id');
    survey_data = survey_data.ignore('trial_type');
    survey_data = survey_data.ignore('trial_index');


    var file_name = ID + '_'+ date + '_' + time + '_results';
    var filePath = 'data/' + file_name;

    var results = MSIT_data.join(DST_data);
    results = results.join(survey_data);
    results = results.join(interaction_data);
    results = results.csv();
    
    let params = {Bucket: bucketName, Key: filePath, Body: results, ContentType: "text/csv"};
    s3.upload(params, function(err, data) {
        if(err){
            console.log(err,err.stack);
        } else {
            console.log('success');
        }
    });


}