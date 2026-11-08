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
};

class FMBucket extends ComponentResource {
  public readonly bucketName: Output<string>;
  public readonly bucketArn: Output<string>;

  constructor(args: FmBucketArgs, opts?: CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    const stack = getStack();

    const suffix = new random.RandomId("bucket-suffix", {
      byteLength: 4,
    });

    const bucketName = suffix.hex.apply(
      (value: any) => `${resourceName}-${stack}-${value}`,
    );

    super("pkg:index:FMBucket", resourceName, {}, opts);

    const bucket = new aws.s3.Bucket(
      args.Name,
      {
        bucket: bucketName,
        tags: {
          Name: bucketName,
          Environment: stack,
        },
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

    this.bucketName = bucket.bucket;
    this.bucketArn = bucket.arn;

    this.registerOutputs({
      bucketName: bucket.bucket,
      bucketArn: bucket.arn,
    });
  }
}

export default FMBucket;
