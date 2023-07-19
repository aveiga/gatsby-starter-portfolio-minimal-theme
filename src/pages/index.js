import React from "react";
import {
  AboutSection,
  ArticlesSection,
  ContactSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
  Animation,
  Section,
  Seo,
} from "gatsby-theme-portfolio-minimal";
import { useStaticQuery, graphql } from "gatsby";

//  Slider,
//  ArticleCard,
//  ArticleCardSkeleton,

export default function IndexPage() {
  const response = useStaticQuery(graphql`
    query VideoListingQuery {
      allYoutubeVideo {
        edges {
          node {
            id
            title
            description
            videoId
            publishedAt
            privacyStatus
            channelTitle
            thumbnail {
              url
              width
              height
            }
          }
        }
      }
    }
  `);
  const [articles, setArticles] = React.useState([]);
  async function collectArticlesFromSources() {
    const articleList = [];

    const blogArticles = response.allYoutubeVideo.edges;
    if (blogArticles.length > 0) {
      blogArticles.forEach((video) => {
        articleList.push({
          image: {
            src: {
              childImageSharp: {
                gatsbyImageData: {
                  layout: "fixed",
                  width: 260,
                  height: 100,
                  images: {
                    //@ts-ignore
                    src: video.node.thumbnail.url,
                  },
                },
              },
            },
          },
          category: video.node.title,
          title: "",
          publishedAt: new Date(video.node.publishedAt),
          link: `https://www.youtube.com/watch?v=${video.node.videoId}`,
          readingTime: "",
        });
      });
    }

    return articleList
      .slice()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  React.useEffect(() => {
    (async function () {
      setArticles(await collectArticlesFromSources());
    })();
  }, []);

  return (
    <>
      <Seo title="Gatsby Starter for Portfolio Minimal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <Animation type="fadeUp" delay={1000}>
          <Section anchor="videos" heading="Últimos Videos">
            {articles.slice(0, 3).map((article, key) => {
              return <div>{article.category}</div>;
            })}
            {/*<Slider additionalClasses="">
              {articles.length > 0
                ? articles.slice(0, 3).map((article, key) => {
                    return (
                      <ArticleCard key={key} data={article} showBanner={true} />
                    );
                  })
                : [...Array(3)].map((_, key) => {
                    return <ArticleCardSkeleton key={key} />;
                  })}
            </Slider>*/}
          </Section>
        </Animation>
        <ArticlesSection
          sectionId="articles"
          heading="Latest Articles"
          sources={["Medium"]}
        />
        <AboutSection sectionId="about" heading="About Portfolio Minimal" />
        <InterestsSection sectionId="details" heading="Details" />
        <ProjectsSection sectionId="features" heading="Built-in Features" />
        <ContactSection sectionId="github" heading="Issues?" />
      </Page>
    </>
  );
}
