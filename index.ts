import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("kode-dev-assets", {
  bucket: "kode-dev-assets",
  tags: {
    developer: "kode",
    environment: "dev",
  },
});

export const bucketName = bucket.id;
export const bucketArn = bucket.arn;
