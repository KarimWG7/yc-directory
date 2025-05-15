import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { STARTUP_BY_ID_QUERYResult } from "@/types.ts";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";
import { PLAYLIST_BY_SLUG_QUERYResult } from "@/sanity/types";

const md = markdownit();

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const [post, editorPicksPlaylist]: [
    post: STARTUP_BY_ID_QUERYResult,
    editorPicksPlaylist: PLAYLIST_BY_SLUG_QUERYResult,
  ] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks",
    }),
  ]);
  const editorPosts = editorPicksPlaylist?.select || [];
  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || "");
  return (
    <>
      <section className="pink_container !min-h-[230px] pattern">
        <p className="tag tag-tri">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>;
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <Image
          src={post?.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image || ""}
                alt={`author ${post.author?.name} avatar`}
                height={64}
                width={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium">{post.author?.username}</p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className="prose max-w-4xl font-work-sans break-all"
            />
          ) : (
            <p className="no-results">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {editorPosts?.length > 0 && (
          <div className="max-w-4xl">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupCardType, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
