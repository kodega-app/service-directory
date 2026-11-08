import { FMFrontend } from "./services/frontend";

function main() {
  const website = new FMFrontend({
    Name: "frontend",
    Product: "development-course",
  });

  return website;
}

const web = main();
export const websiteEndpoint = web.websiteEndpoint;
