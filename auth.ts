import NextAuth, { Profile, Session, User } from "next-auth";
import Github from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Github],
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile) return false;

      const { name, email, image } = user;
      const { id, bio, login } = profile as any;

      let exisitingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });
      if (!exisitingUser) {
        await writeClient.create({
          _type: "author",
          _id: id,
          id: Number(id),
          name: name ?? null,
          username: login ?? null,
          email: email ?? null,
          image: image ?? null,
          bio: bio ?? null,
        });
      }
      return true;
    },

    async jwt({ token, profile, account }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        token.id = user?._id;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        id: token.id,
      };
    },
  },
});
