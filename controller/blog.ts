import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as joi from "joi";

const blogRequest = joi.object({
title: joi.string().required(),
  content: joi.string().required(),
  category: joi.string().optional(),
  type: joi.string().required(),
});

class Blog {
  private prisma = new PrismaClient();

  createBlog = async (request: Request, response: Response) => {
    try {
      const { error } = blogRequest.validate(request.body);
      if (error) {
        return response.status(400).json({ error: error.details[0].message });
      }

      const { title, content, category, type } = request.body;
      const timestamp = new Date().toISOString();

      const blog = await this.prisma.blog.create({
        data: {
          title,
          content,
          timestamp,
          type,
          category,
        },
      });

      return response.status(201).json({
        message: "success",
        data: blog,
      });
    } catch (err) {
      console.error("Error creating blog:", err);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateBlog = async (request: Request, response: Response) => {
    const blogId = parseInt(request.params.id, 10);

    if (!blogId) {
      return response.status(400).json({ error: "A valid blog id is needed!!" });
    }

    try {
      const updatedBlog = await this.prisma.blog.update({
        where: { id: blogId },
        data: {
          title: request.body.title,
          content: request.body.content,
        },
      });

      return response.status(200).json({
        message: "Blog updated successfully",
        data: updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  };

  getAllBlog = async (request: Request, response: Response) => {
    const skip: number = parseInt(request.query.skip, 10) || 10;
    const page: number = parseInt(request.query.page, 10) || 0;
    const type: string = request.query.type || "ENGLISH";

    try {
      const blogs = await this.prisma.blog.findMany({
        skip: page * skip,
        take: skip,
        orderBy: {
          id: "asc",
        },
        where: {
          type,
        },
      });

      if (!blogs || blogs.length === 0) {
        return response.status(404).json({ message: "Blogs not found." });
      }

      return response.status(200).json({
        message: "success",
        data: blogs,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  };

  getBlogById = async (request: Request, response: Response) => {
    const blogId = parseInt(request.params.id, 10);

    if (!blogId) {
      return response.status(400).json({ message: "Invalid Blog Id." });
    }

    try {
      const blog = await this.prisma.blog.findFirst({
        where: {
          id: blogId,
        },
      });

      if (!blog) {
        return response.status(404).json({ message: "Blog not found." });
      }

      return response.status(200).json({
        message: "success",
        data: blog,
      });
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  };

  deleteBlog = async (request: Request, response: Response) => {
    const blogId = parseInt(request.params.id, 10);

    if (!blogId) {
      return response.status(400).json({ message: "Invalid Blog Id." });
    }

    try {
      const deletedBlog = await this.prisma.blog.delete({
        where: {
          id: blogId,
        },
      });

      if (!deletedBlog) {
        return response.status(404).json({ message: "Blog not found." });
      }

      return response.status(200).json({
        message: "success",
        data: deletedBlog,
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default Blog;
