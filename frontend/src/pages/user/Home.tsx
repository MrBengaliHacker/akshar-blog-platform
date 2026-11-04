// Components
import { Page } from '@/components/Page';
import { Hero } from '@/components/Home/Hero';
import { Stats } from '@/components/Home/Stats';
import { Trending } from '@/components/Home/Trending';
import { Topics } from '@/components/Home/Topics';
import { LatestArticles } from '@/components/Home/LatestArticles';
import { Writers } from '@/components/Home/Writers';
import { CtaBanner } from '@/components/Home/CtaBanner';

export const Home = () => {
  return (
    <Page>
      <Hero />
      <Stats />
      <Trending />
      <Topics />
      <LatestArticles />
      <Writers />
      <CtaBanner />
    </Page>
  );
};