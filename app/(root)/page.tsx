import React from "react";
import SearchForm from "../../components/SearchForm";
import { StartupCardType } from "@/types/types";
import StartupCard from "@/components/StartupCard";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;
  const posts: StartupCardType[] = [
    {
      _createdAt: new Date(),
      views: 55,
      author: { _id: 1, name: "karim ghanem" },
      _id: 1,
      description: "This is the description",
      image: "https://picsum.photos/600/400",
      category: "Tech",
      title: "Nextjs",
    },
  ];
  return (
    <>
      <section className="pink_container pattern">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Enterpreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Bote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post) => <StartupCard post={post} key={post._id} />)
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
};

export default Home;
