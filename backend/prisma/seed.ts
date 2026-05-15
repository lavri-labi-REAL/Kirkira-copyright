import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + (process.env.JWT_SECRET || "change-me"))
    .digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@kirkira.co.ke" },
    update: {},
    create: {
      email: "test@kirkira.co.ke",
      password: hashPassword("testpassword123"),
      full_name: "Test User",
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create a sample draft application
  const app = await prisma.application.create({
    data: {
      user_id: user.id,
      status: "DRAFT",
      wizard_step: 1,
      category_id: "LIT",
      subcategory_id: "LIT-BOOK",
      llm_confidence: 0.95,
      title: "The Nairobi Chronicles",
      description: "A collection of interconnected short stories set in modern Nairobi.",
      applicant_profile_snapshot: {
        full_name: "Test User",
        id_number: "123456789",
        id_type: "national_id",
        email: "test@kirkira.co.ke",
        phone: "+254700000000",
        address: "123 Kenyatta Avenue",
        city: "Nairobi",
        country: "KE",
        is_corporate: false,
      },
      owners: [],
      work_metadata: {
        genre: "Fiction",
        num_pages: 280,
        year_of_creation: 2024,
        country_of_origin: "KE",
        language: "English",
        is_published: false,
        is_commissioned: false,
      },
    },
  });

  console.log(`Created sample application: ${app.id}`);
  console.log("\nSeed complete!");
  console.log("\nTest credentials:");
  console.log("  Email:    test@kirkira.co.ke");
  console.log("  Password: testpassword123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
