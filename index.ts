import { FMFrontend } from "./services/frontend";
import { FMBackend } from "./services/backend";

const website = new FMFrontend({
  Name: "frontend",
  Product: "development-course",
});

const backend = new FMBackend({
  Name: "backend",
  Product: "development-course",
});

export const websiteEndpoint = website.websiteEndpoint;
export const ecrRepository = backend.ecrRepository;
