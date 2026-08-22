import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getAllBlogs } from "@/lib/blogs";

export const dynamic = "force-static";

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json({ success: true, blogs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, blog } = body;

    const jsonPath = path.join(process.cwd(), "public", "blog", "blog.json");
    let blogs: any[] = [];
    if (fs.existsSync(jsonPath)) {
      blogs = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }

    if (action === "create" || action === "update") {
      const existingIndex = blogs.findIndex((b) => b.slug === blog.slug);
      if (existingIndex >= 0) {
        blogs[existingIndex] = { ...blogs[existingIndex], ...blog };
      } else {
        blogs.unshift(blog);
      }

      fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2), "utf-8");

      // Also upsert in SQLite DB
      try {
        await prisma.blogPost.upsert({
          where: { slug: blog.slug },
          update: {
            title: blog.title,
            category: blog.category,
            summary: blog.summary,
            content: blog.content || blog.summary,
            image: blog.image,
            priceHighlight: blog.priceHighlight,
            keywords: JSON.stringify(blog.keywords || []),
            readMin: blog.readMin || "5 min read",
          },
          create: {
            slug: blog.slug,
            title: blog.title,
            category: blog.category,
            summary: blog.summary,
            content: blog.content || blog.summary,
            image: blog.image,
            priceHighlight: blog.priceHighlight,
            keywords: JSON.stringify(blog.keywords || []),
            readMin: blog.readMin || "5 min read",
            published: true,
          },
        });
      } catch (e) {
        console.warn("DB blog upsert warning", e);
      }

      return NextResponse.json({ success: true, message: "Blog saved successfully!", blogs });
    }

    if (action === "delete") {
      blogs = blogs.filter((b) => b.slug !== blog.slug);
      fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2), "utf-8");

      try {
        await prisma.blogPost.deleteMany({ where: { slug: blog.slug } });
      } catch {}

      return NextResponse.json({ success: true, message: "Blog deleted successfully!", blogs });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
