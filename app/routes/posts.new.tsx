import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Post" },
    { name: "description", content: "New Post" },
  ];
};

export default function NewPost() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">New Post</h1>
    </div>
  );
}
