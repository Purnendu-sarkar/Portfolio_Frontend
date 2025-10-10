/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";

export const createBlog = async (formData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      },
      body: formData,
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
