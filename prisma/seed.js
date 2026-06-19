const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "project_brand_new_day",
    user: "postgres",
    password: "postgres",
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const password = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password,
    },
  });

  console.log("Created admin user:", user.email);

  const projects = [
    {
      title: "Project Alpha",
      description:
        "A full-stack web application built with Next.js and PostgreSQL. Features real-time updates, authentication, and a beautiful responsive UI.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      githubUrl: "https://github.com/username/project-alpha",
      liveUrl: "https://project-alpha.vercel.app",
      featured: true,
    },
    {
      title: "Project Beta",
      description:
        "Real-time collaboration platform with WebSocket integration. Designed for teams to work together seamlessly.",
      techStack: ["React", "Node.js", "Socket.io", "Redis", "Docker"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      githubUrl: "https://github.com/username/project-beta",
      liveUrl: "https://project-beta.vercel.app",
      featured: true,
    },
    {
      title: "Project Gamma",
      description:
        "Mobile-first application built with React Native. Focused on providing an exceptional user experience on all devices.",
      techStack: ["React Native", "TypeScript", "GraphQL", "Firebase"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      githubUrl: "https://github.com/username/project-gamma",
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log(`Seeded ${projects.length} projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = require("@prisma/client");
    // can't disconnect easily here, skipping
  });
