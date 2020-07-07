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