// AWS Bucket Configurations
var bucketName = 'princeton-ncclab-msit-dst-data';
var bucketRegion = 'us-east';

AWS.config.update({
    region: bucketRegion,
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
});

var aws_upload = function(results, fileName) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:65248965-3df0-4276-a440-f95155cf15fd",
        });

    var filePath = 'data/' + fileName;
    let params = {Bucket:bucketName, Key:filePath, Body:'test'};

    s3.upload(params, function(err,data) {
        if(err){
          console.log(err,err.stack);
        } else {
          console.log('success');
        }
    });

};