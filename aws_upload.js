// AWS Bucket Configurations
var bucketName = 'princeton-ncclab-msit-dst';
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:65248965-3df0-4276-a440-f95155cf15fd',
});

var s3 = new AWS.S3({
    apiVersion: '2012-10-17',
    params: {Bucket: bucketName}
});

var aws_upload = function(fileName) {
    // data getting
    // add subject ID to data
    jsPsych.data.get().addToAll({worker_ID: ID});
    var interaction_data = jsPsych.data.getInteractionData();

    // filter data by experiment phase
    var MSIT_dst_data = jsPsych.data.get().filterCustom(function(trial){
        return ((trial.phase =='MSIT') || (trial.phase =='demand selection'));
    });
    MSIT_dst_data = MSIT_dst_data.ignore('internal_node_id');
    MSIT_dst_data = MSIT_dst_data.ignore('trial_type');
    MSIT_dst_data = MSIT_dst_data.ignore('trial_index');

    var file_name = 'ID:' + ID + '_'+ date + '_' + time + '_results.csv';
    var filePath = 'data/' + file_name;
                
    let params = {Bucket:bucketName, Key:filePath,Body: {MSIT_data: MSIT_dst_data.csv(), interactionData: interaction_data.csv()}};
    s3.upload(params, function(err, data) {
        if(err){
            console.log(err,err.stack);
        } else {
            console.log('success');
        }
    });
}
