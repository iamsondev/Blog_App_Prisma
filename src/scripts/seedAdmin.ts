import { prisma } from "../lib/prisma";
import { useRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin",
      email: "admin@gmail.com",
      role: useRole.ADMIN,
      password: "admin1234",
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
  } catch (error) {
    console.error(error);
  }
}
