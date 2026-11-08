import { FMFrontend } from "./services/frontend";

function main() {
  new FMFrontend({
    Name: "frontend",
    Product: "development-course",
  });
}

main();
