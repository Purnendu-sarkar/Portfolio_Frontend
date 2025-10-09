/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";

export const createBlog = async (data: FormData) => {
    try {
        const title = data.get("title") as string;
        const content = data.get("content") as string;
        const thumbnail = data.get("thumbnail") as string;
        const tags = data.get("tags") as string;

        const payload = {
            title,
            content,
            thumbnail,
            tags: tags?.split(",").map((t) => t.trim()) || [],
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
            return { success: false, message: result.message || "Error creating blog" };
        }

        revalidateTag("blogs");
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
