import FMBucket from "./resources/bucket";

const bucket = new FMBucket({
  Name: "terraform",
  Product: "devops-course-by-kode",
});

export const bucketName = bucket.bucketName;
export const bucketArn = bucket.bucketArn;
