"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBlogs() {
  revalidateTag("blogs");
}
export async function revalidateProjects() {
  revalidateTag("projects");
}