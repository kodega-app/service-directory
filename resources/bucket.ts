import pulumi from "@pulumi/pulumi";
import aws from "@pulumi/aws";
import { getStack } from "@pulumi/pulumi/runtime";

type FmBucketArgs = {
  Name: string;
  Product: string;
};

class FMBucket extends pulumi.ComponentResource {
  constructor(args: FmBucketArgs, opts?: pulumi.ResourceOptions) {
    const resourceName = `{args.Product}-${args.Name}`;
    const stack = getStack();
    const bucketName = `{name}-${stack}`;

    super("pkg:index:FMBucket", resourceName, {}, opts);

    const bucket = new aws.s3.Bucket(
      args.Name,
      {
        acl: "private",
        tags: {
          Name: bucketName,
          Environment: stack,
        },
      },
      opts,
    );

    new aws.s3.BucketPublicAccessBlock(args.Name, {
      bucket: bucket.id,
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    });
  }
}

export default FMBucket;
