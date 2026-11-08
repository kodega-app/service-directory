import {
  ComponentResource,
  CustomResourceOptions,
  Output,
} from "@pulumi/pulumi";
import { getStack } from "@pulumi/pulumi/runtime";
import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";

type FmBucketArgs = {
  Name: string;
  Product: string;
  Public?: boolean;
};

class FMBucket extends ComponentResource {
  public readonly bucketName: Output<string>;
  public readonly bucketArn: Output<string>;
  public readonly websiteEndpoint?: Output<string>;

  constructor(args: FmBucketArgs, opts?: CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    const stack = getStack();

    super("pkg:index:FMBucket", resourceName, {}, opts);

    const suffix = new random.RandomId(
      `${args.Product}-${args.Name}-bucket-suffix`,
      {
        byteLength: 4,
      },
      {
        parent: this,
      },
    );

    const bucketName = suffix.hex.apply(
      (value: any) => `${resourceName}-${stack}-${value}`,
    );

    const bucketArgs: aws.s3.BucketArgs = {
      tags: {
        Name: bucketName,
        Environment: stack,
      },
    };

    const bucket = new aws.s3.Bucket(
      args.Name,
      {
        bucket: bucketName,
        ...bucketArgs,
      },
      {
        parent: this,
      },
    );

    new aws.s3.BucketOwnershipControls(
      `${resourceName}-ownership`,
      {
        bucket: bucket.id,
        rule: {
          objectOwnership: "BucketOwnerEnforced",
        },
      },
      { parent: this },
    );

    if (!args.Public) {
      new aws.s3.BucketPublicAccessBlock(
        args.Name,
        {
          bucket: bucket.id,
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
        {
          parent: this,
        },
      );
    } else {
      new aws.s3.BucketPolicy(
        `${resourceName}-public-policy`,
        {
          bucket: bucket.id,
          policy: bucket.arn.apply((arn) =>
            JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Principal: "*",
                  Action: "s3:GetObject",
                  Resource: `${arn}/*`,
                },
              ],
            }),
          ),
        },
        { parent: this },
      );

      const website = new aws.s3.BucketWebsiteConfiguration(
        resourceName,
        {
          indexDocument: {
            suffix: "index.html",
          },
          errorDocument: {
            key: "error.html",
          },
          routingRules: [
            {
              condition: {
                keyPrefixEquals: "docs/",
              },
              redirect: {
                replaceKeyPrefixWith: "documents/",
              },
            },
          ],
          bucket: bucket.id,
        },
        { parent: this },
      );

      this.websiteEndpoint = website.websiteEndpoint;
    }

    this.bucketName = bucket.bucket;
    this.bucketArn = bucket.arn;

    this.registerOutputs({
      bucketName: bucket.bucket,
      bucketArn: bucket.arn,
      websiteEndpoint: this.websiteEndpoint,
    });
  }
}

export default FMBucket;
