import { seedReviews } from "./seed-reviews.js";

const result = await seedReviews();
console.log(
  `Reviews seed complete: ${result.reviews} new reviews across ${result.doctors} doctors`,
);
process.exit(0);
