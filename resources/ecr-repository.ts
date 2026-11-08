import { ComponentResource, getStack, Output } from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type FMECRRepositoryArgs = {
  Name: string;
  Product: string;
};

export class FMECRRepository extends ComponentResource {
  public readonly repositoryUrl: Output<string>;

  constructor(args: FMECRRepositoryArgs, opts?: any) {
    const resourceName = `${args.Product}-${args.Name}`;
    const stack = getStack();

    super("pkg:index:FMECRRepository", resourceName, {}, opts);

    const repo = new aws.ecr.Repository(
      resourceName,
      {
        imageScanningConfiguration: {
          scanOnPush: true,
        },
        name: resourceName,
        imageTagMutability: "MUTABLE",
        tags: {
          Name: resourceName,
          Environment: stack,
        },
      },
      {
        parent: this,
      },
    );

    this.repositoryUrl = repo.repositoryUrl;

    this.registerOutputs({
      repositoryUrl: this.repositoryUrl,
    });
  }
}
