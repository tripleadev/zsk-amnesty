import Head from "next/head";

export const SEO = ({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) => {
  const fullTitle = title ? `${title} – ZSK Amnesty` : `ZSK Amnesty`;

  const fullDescription =
    description || `Maraton pisania listów Anesty International w ZSK ${new Date().getFullYear()}`;

  const fullImage =
    image || "https://raw.githubusercontent.com/tripleadev/zsk-amnesty/main/amnesty-logo.png";

  return (
    <Head>
      <title>{fullTitle}</title>
      <link rel="icon" href="/logo.png" />

      <meta name="title" content={title || fullTitle} />
      <meta name="description" content={fullDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zsk-amnesty.vercel.app/" />
      <meta property="og:title" content={title || fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />

      {/* <meta property="twitter:card" content="summary_large_image" /> */}
      <meta property="twitter:url" content="https://zsk-amnesty.vercel.app/" />
      <meta property="twitter:domain" content="zsk-amnesty.vercel.app" />
      <meta property="twitter:title" content={title || fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />

      <meta property="og:site_name" content="ZSK Amnesty" />
      <meta name="theme-color" content="#ffff00" />
    </Head>
  );
};
