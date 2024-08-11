import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Posts" },
    { name: "description", content: "Posts" },
  ];
};

export default function Posts() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Posts</h1>
      <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="/posts/new"
            rel="noreferrer"
          >
            New post
          </a>
   </div>
  );
}
