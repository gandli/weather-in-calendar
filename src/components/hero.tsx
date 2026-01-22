import { getLocale } from "next-intl/server";
import { HeroSearch } from "./hero-search";
import { WeatherDisplay } from "./weather-display";

interface HeroProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function Hero({ searchParams }: HeroProps) {
  const locale = await getLocale();
  const defaultCity = locale === 'zh' ? '上海' : 'New York';

  const cityParam = searchParams?.city;
  const city = typeof cityParam === 'string' && cityParam ? cityParam : defaultCity;

  const unitParam = searchParams?.unit;
  const unit = (typeof unitParam === 'string' && (unitParam === 'C' || unitParam === 'F')) ? unitParam : "C";

  return (
    <section id="subscribe" className="relative pt-32 pb-20">
      <HeroSearch defaultCity={city} defaultUnit={unit} />
      <WeatherDisplay city={city} unit={unit} />
    </section>
  );
}
