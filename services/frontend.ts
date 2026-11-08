import {
  ComponentResource,
  CustomResourceOptions,
  Output,
} from "@pulumi/pulumi";
import FMBucket from "../resources/bucket";

type FMFrontendArgs = {
  Name: string;
  Product: string;
};

export class FMFrontend extends ComponentResource {
  public readonly websiteEndpoint: Output<string> | undefined;

  constructor(args: FMFrontendArgs, opts?: CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:FMFrontend", resourceName, {}, opts);

    const public_web = new FMBucket(
      {
        Name: args.Name,
        Product: args.Product,
        Public: true,
      },
      {
        parent: this,
      },
    );

    new FMBucket(
      {
        Name: `${args.Name}-replica`,
        Product: args.Product,
      },
      {
        parent: this,
      },
    );

    this.websiteEndpoint = public_web.websiteEndpoint;
    this.registerOutputs({
      websiteEndpoint: this.websiteEndpoint,
    });
  }
}
