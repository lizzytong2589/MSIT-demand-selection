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

    // ADD BACK FOR USE WITH MTURK 
    // jsPsych.data.get().addToAll({consent_initials:sessionStorage.getItem('consent_initials'), consent_date:sessionStorage.getItem('consent_date')});
    // jsPsych.data.get().addToAll({worker_ID: ID, MTurk_completion_code: completion_code});
    
    jsPsych.data.get().addToAll({prolific_ID: prolific_ID, completion_code: completion_code});
    file_name = sessionStorage.getItem('prolific_ID') + '_'+ date + '_' + time + '_results';
    file_path = 'data/Prolific/' + file_name;

    var data = jsPsych.data.get();
    data = data.csv();

    pass_message(jsPsych.data.getInteractionData().json()); 

    let params = {Bucket: bucketName, Key: file_path, Body: data, ContentType: "text/csv"};
    s3.upload(params, function(err, data) {
        if(err){
            console.log(err,err.stack);
        } else {
            console.log('success');
        }
    });


}