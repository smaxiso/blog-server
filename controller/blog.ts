import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { request } from 'http';
import * as joi from 'joi';

const blogRequest = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    category: joi.string().optional(),
    type: joi.string().required()
})

class Blog{
    prisma = new PrismaClient();

    createBlog = async (request: any, response: Response) => {
        const {error, value} = blogRequest.validate(request.body);
        const {
            title,
            content,
            category,
            type
        } = request.body;
        if(error){
            return response.status(400).json({ error: error.details[0].message });
        }
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const timestamp = today.toISOString();
        const blog = await this.prisma.blog.create({
            data: {
                title,
                content,
                timestamp,
                type,
                category
            }

        })
        return response.status(200).json({
            "message" : "success",
            "data": blog
        })
    }

    updateBlog = async (request: any, response: Response) => {
        const blogId = request.id;
        if (!blogId){
            return response.status(400).json({ error: "A blog id is needed!!" });
        }

        const existingBlog = await this.prisma.blog.findUnique({
            where: { id: blogId },
          });
    
        if (!existingBlog) {
        return response.status(400).json({ message: 'Blog does not exists.' });
        }
        if(request.title){
            existingBlog.title = request.title;
        }
        if(request.content){
            existingBlog.content = request.content;
        }

        const updatedBlog = await this.prisma.blog.update({
            where: { id:blogId },
            data: {
              title: existingBlog.title,
              content: existingBlog.content
            },
          });

        return response
        .status(200)
        .json({ message: 'Blog updated successfully', "data":updatedBlog });

    }

    getAllBlog = async (request: any, response: Response) => {
        const skip:any = (request.skip) || 10;
        let page:any = (request.page) || 0;
        const type = (request.type) || "ENGLISH";
        const blogs = this.prisma.blog.findMany(
            {
                skip:page*skip,
                take:skip,
                orderBy: {
                    id: 'asc'
                },
                where:{
                    type
                }
            }
        )
        
        if(!blogs){
            return response.status(400).json({ message: 'Blogs does not exists.' }); 
        }

        return response.status(200).json({
            message: "success",
            data: blogs
        })
    }

    getBlogById = async (request: any, response: Response) => {
        if(!request.params.id){
            return response.status(400).json({ message: 'Blog Id does not exists.'});
        }
        const id = request.params.id;
        const blog = this.prisma.blog.findFirst({
            where:{
                id
            },
        })

        return response.status(200).json({
            message: "success",
            data: blog
        })
    }

    deleteBlog = async (request: any, response: Response) => {
        if(!request.body.id){
            return response.status(400).json({ message: 'Blog Id does not exists.'});
        }

        const id = request.body.id;

        const blog = this.prisma.blog.delete({
            where: {
              id  
            }
        })

        return response.status(200).json({
            message: "success",
            data: blog
        })
    }
}

export default Blog;