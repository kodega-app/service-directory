import { ComponentResource } from "@pulumi/pulumi";

type FMECRRepositoryArgs = {
  Name: string;
  Product: string;
};

export class FMECRReposiatory extends ComponentResource {
  constructor(args: FMECRRepositoryArgs, opts?: any) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:FMECRRepository", resourceName, {}, opts);
  }
}
