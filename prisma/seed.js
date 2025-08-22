// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const mediaItems = [
    {
      slug: "image-4",
      src: "/gallery/image (4).jpg",
      description: "Image 4 — sample gallery item",
      author: "Admin",
      likes: 5,
      shares: 1,
      views: 12,
      createdAt: new Date("2025-08-08T20:03:04+04:00"),
    },
    {
      slug: "image-5",
      src: "/gallery/image (5).jpg",
      description: "Image 5 — sample gallery item",
      author: "Admin",
      likes: 8,
      shares: 2,
      views: 20,
      createdAt: new Date("2025-08-08T20:02:11+04:00"),
    },
    {
      slug: "video-1",
      src: "/gallery/video (1).mp4",
      description: "Video 1 — sample reel",
      author: "Uploader",
      likes: 15,
      shares: 3,
      views: 120,
      createdAt: new Date("2025-08-08T21:25:10+04:00"),
    },
    {
      slug: "video-2",
      src: "/gallery/video (2).mp4",
      description: "Video 2 — sample reel",
      author: "Uploader",
      likes: 20,
      shares: 4,
      views: 210,
      createdAt: new Date("2025-08-08T21:44:34+04:00"),
    },
    {
      slug: "video-3",
      src: "/gallery/video (3).mp4",
      description: "Video 3 — sample reel",
      author: "Uploader",
      likes: 12,
      shares: 1,
      views: 95,
      createdAt: new Date("2025-08-08T21:43:42+04:00"),
    },
  ];

  for (const item of mediaItems) {
    await prisma.mediaItem.upsert({
      where: { slug: item.slug },
      update: {
        src: item.src,
        description: item.description,
        author: item.author,
        likes: item.likes,
        shares: item.shares,
        views: item.views,
      },
      create: {
        slug: item.slug,
        src: item.src,
        description: item.description,
        author: item.author,
        likes: item.likes,
        shares: item.shares,
        views: item.views,
        createdAt: item.createdAt,
      },
    });
    console.log(`Upserted mediaItem ${item.slug}`);
  }

  const linkItems = [
    {
      slug: "instagram",
      logoUrl: "/logo/links/instagram-logo.png",
      backgroundCss:
        "linear-gradient(45deg,#feda75 0%,#fa7e1e 25%,#d62976  50%,#962fbf  75%,#4f5bd5  100%)",
      textColor: "#ffffff",
      label: "اینستاگرام",
      username: "@your-username",
      targetUrl: "https://instagram.com/your-username",
      createdAt: new Date("2025-08-22T18:56:36+04:00"),
    },
    {
      slug: "github",
      logoUrl: "/logo/Links/github.png",
      backgroundCss: "linear-gradient(to bottom, #302F34, #1A191C)", // vertical gradient
      textColor: "#ffffff",
      label: "گیت‌هاب",
      username: "@your-username",
      targetUrl: "https://github.com/your-username",
      createdAt: new Date("2025-08-22T18:55:01+04:00"),
    },
    {
      slug: "ita",
      logoUrl: "/logo/links/ITA-logo.png",
      backgroundCss: "linear-gradient(to bottom, #E58025, #F0422A)", // vertical gradient
      textColor: "#ffffff",
      label: "ایتا",
      username: "@ita-user",
      targetUrl: "https://ita.example.com",
      createdAt: new Date("2025-08-22T18:54:42+04:00"),
    },
    {
      slug: "linkedin",
      logoUrl: "/logo/links/linked-in.png",
      backgroundCss: "linear-gradient(to bottom, #3C75C6, #144589)", // vertical gradient
      textColor: "#ffffff",
      label: "لینکدین",
      username: "@your-username",
      targetUrl: "https://linkedin.com/in/your-username",
      createdAt: new Date("2025-08-01T19:00:17+04:00"),
    },
    {
      slug: "telegram",
      logoUrl: "/logo/links/telegram.png",
      backgroundCss: "#0088cc",
      textColor: "#ffffff",
      label: "تلگرام",
      username: "@your-username",
      targetUrl: "https://t.me/your-username",
      createdAt: new Date("2025-08-22T18:55:06+04:00"),
    },
    {
      slug: "whatsapp",
      logoUrl: "/logo/links/WhatsApp.webp",
      backgroundCss: "#25D366",
      textColor: "#ffffff",
      label: "واتساپ",
      username: "@your-number", // e.g. 9715xxxxxxx
      targetUrl: "https://wa.me/9715XXXXXXXX",
      createdAt: new Date("2025-08-22T19:15:34+04:00"),
    },
  ];

  for (const link of linkItems) {
    await prisma.link.upsert({
      where: { slug: link.slug },
      update: {
        logoUrl: link.logoUrl,
        backgroundCss: link.backgroundCss,
        textColor: link.textColor,
        label: link.label,
        username: link.username,
        targetUrl: link.targetUrl,
      },
      create: {
        slug: link.slug,
        logoUrl: link.logoUrl,
        backgroundCss: link.backgroundCss,
        textColor: link.textColor,
        label: link.label,
        username: link.username,
        targetUrl: link.targetUrl,
        createdAt: link.createdAt,
      },
    });
    console.log(`Upserted link ${link.slug}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
