import { ComponentResource, CustomResourceOptions } from "@pulumi/pulumi";
import FMBucket from "../resources/bucket";

type FMFrontendArgs = {
  Name: string;
  Product: string;
};

export class FMFrontend extends ComponentResource {
  constructor(args: FMFrontendArgs, opts?: CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:FMFrontend", resourceName, {}, opts);

    const bucket = new FMBucket(
      {
        Name: args.Name,
        Product: args.Product,
      },
      {
        parent: this,
      },
    );
  }
}
