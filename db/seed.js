const { PrismaClient } = require('@prisma/client');
const {faker} = require('@faker-js/faker');

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding the database.");
  try {
    const users = await Promise.all(
      [...Array(3)].map(async () => {
        return prisma.user.create({
          data: {
            username: faker.person.firstName(),
            password: faker.internet.password(),
          },
        });
      })
    );

    await Promise.all(
      users.map(async (user) => {
        await Promise.all(
          [...Array(3)].map(async () => {
            await prisma.post.create({
              data: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                userID: user.id,
              },
            });
          })
        );
      })
    );

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
