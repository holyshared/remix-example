import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useLoaderData,
} from "@remix-run/react";

interface Post {
  id: number
  title: string
  content: string
}

export const meta: MetaFunction = () => {
  return [
    { title: "Posts" },
    { name: "description", content: "Posts" },
  ];
};

const getPosts = async () => {
  return new Promise<Post[]>((resolve) => {
    const posts = [{
      id:1,
      title: "post1",
      content: "content1"
    },{
      id:2,
      title: "post2",
      content: "content2"
    }];
    resolve(posts)
  })
}

export const loader = async () => {
  const posts = await getPosts();
  return json({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Posts</h1>
      <a
            className="text-blue-700 underline visited:text-purple-900"
            href="/posts/new"
            rel="noreferrer"
          >
            New post
          </a>
      <ul>
        {posts.map((p) => <li key={p.id}>{p.title}{p.content}</li> )}
      </ul>
   </div>
  );
}
