// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const TELEGRAM_COACH_ID = "1689799000";
const TELEGRAM_CLIENT_ID = "1689799745";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding IDM...");

  const passwordHash = await bcrypt.hash("Ooooorrrr11!", 10);

  /* ----------------------------------------
        CREATE COACH
  ---------------------------------------- */
  const coach = await prisma.user.upsert({
    where: { email: "coach@test.com" },
    update: {},
    create: {
      email: "coach@test.com",
      phone: TELEGRAM_COACH_ID,
      firstName: "אורגד",
      lastName: "וייצמן",
      role: "coach",
      status: "active",
    },
  });

  // Credentials (CREATE if not exists)
  const coachCred = await prisma.credential.findFirst({
    where: { userId: coach.id },
  });

  if (!coachCred) {
    await prisma.credential.create({
      data: {
        userId: coach.id,
        type: "password",
        passwordHash,
        status: "active",
      },
    });
  }

  await prisma.userInformation.upsert({
    where: { userId: coach.id },
    update: {},
    create: {
      userId: coach.id,
      height: 180,
      age: 30,
      gender: "male",
      city: "Tel Aviv",
      profileImageUrl:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    },
  });

  // Subscription (CREATE if not exists)
  const coachSub = await prisma.subscription.findFirst({
    where: { userId: coach.id },
  });

  if (!coachSub) {
    await prisma.subscription.create({
      data: {
        userId: coach.id,
        userType: "customer",
        type: "pro",
        startDate: new Date(),
        status: "active",
      },
    });
  }

  console.log("✔ Coach created:", coach.email);

  /* ----------------------------------------
        CREATE MANY CLIENTS
  ---------------------------------------- */

  const firstNames = [
    "דוד", "יוסי", "משה", "שיר", "נועה", "עדן", "דניאל", "רותם",
    "אור", "שקד", "יעל", "מאיה", "יואב", "תומר", "ניצן", "שון",
    "לינוי", "הילה", "רוני", "אליעד"
  ];

  const lastNames = [
    "כהן", "לוי", "ביטון", "מזרחי", "פרץ", "אלבז", "חדד",
    "מלול", "ברוך", "וולף", "שטרן"
  ];

  for (let i = 1; i <= 20; i++) {
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];

    const email = `client${i}@test.com`;
    const phone = i === 1
      ? TELEGRAM_CLIENT_ID
      : `050${Math.floor(1000000 + Math.random() * 9000000)}`;
    const gender = Math.random() > 0.5 ? "male" : "female";
    const avatar = `https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${((i % 6) + 1)}.jpg`;

    // USER
    const client = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        phone,
        firstName,
        lastName,
        role: "client",
        status: "active",
      },
    });

    // CREDENTIAL
    const existingCred = await prisma.credential.findFirst({
      where: { userId: client.id },
    });

    if (!existingCred) {
      await prisma.credential.create({
        data: {
          userId: client.id,
          type: "password",
          passwordHash,
          status: "active",
        },
      });
    }

    // USER INFORMATION
    await prisma.userInformation.upsert({
      where: { userId: client.id },
      update: {},
      create: {
        userId: client.id,
        age: Math.floor(18 + Math.random() * 30),
        height: Math.floor(155 + Math.random() * 30),
        gender,
        city: ["תל אביב", "רמת גן", "חולון", "בת ים", "ראשון לציון"][
          Math.floor(Math.random() * 5)
        ],
        profileImageUrl: avatar,
      },
    });

    // SUBSCRIPTION
    const existingSub = await prisma.subscription.findFirst({
      where: { userId: client.id },
    });

    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          userId: client.id,
          userType: "customer",
          type: "free",
          startDate: new Date(),
          status: "active",
        },
      });
    }

    console.log(`✔ Client ${i} created: ${email}`);
  }

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
