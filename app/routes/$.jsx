import Layout from "../components/Layout";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  getStoryblokApi,
  useStoryblokState,
  StoryblokComponent,
} from "@storyblok/react";

export default function Page() {
  let story = useLoaderData();
  story = useStoryblokState(story, {
    resolveRelations: ["featured-posts.posts", "selected-posts.posts"],
    language: locale,
  });

  return (
    <Layout>
      <StoryblokComponent blok={story.content} />
    </Layout>
  )
};

export const loader = async ({ params, preview = false }) => {
  let slug = params["*"] ?? "home";
  let blogSlug = params["*"] === "blog/" ? "blog/home" : null;

  let sbParams = {
    version: "draft", // or 'draft'
    resolve_relations: ["featured-posts.posts", "selected-posts.posts"],
  };

  if (preview) {
    sbParams.version = "draft"
    sbParams.cv = Date.now()
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/${blogSlug ? blogSlug : slug}`, sbParams);
  return json(data?.story, preview);
};
