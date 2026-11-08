import { ComponentResource, Output } from "@pulumi/pulumi";
import { FMECRRepository } from "../resources/ecr-repository";

type FMBackendArgs = {
  Name: string;
  Product: string;
};

export class FMBackend extends ComponentResource {
  public readonly ecrRepository: Output<string>;

  constructor(args: FMBackendArgs, opts?: any) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:FMBackend", resourceName, {}, opts);

    const ecrRepository = new FMECRRepository(
      {
        Name: args.Name,
        Product: args.Product,
      },
      {
        parent: this,
      },
    );

    this.ecrRepository = ecrRepository.repositoryUrl;
    this.registerOutputs({
      ecrRepository: this.ecrRepository,
    });
  }
}
