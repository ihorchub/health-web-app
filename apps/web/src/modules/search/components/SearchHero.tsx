import { IconCalendarEvent, IconCheckbox, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  Hero,
  HeroCopy,
  HeroImage,
  HeroStep,
  HeroStepIcon,
  HeroStepLabel,
  HeroSteps,
  HeroSubtitle,
  HeroTitle,
} from '@/modules/search/styles';

const HERO_SRC = '/brand/hero/scr02-hero-doctor-lika.png';

export const SearchHero = () => {
  const { t } = useTranslation('search');

  return (
    <Hero>
      <HeroCopy>
        <div>
          <HeroTitle>{t('hero.title')}</HeroTitle>
          <HeroSubtitle>{t('hero.subtitle')}</HeroSubtitle>
        </div>
        <HeroSteps>
          <HeroStep>
            <HeroStepIcon>
              <IconSearch size={22} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepFind')}</HeroStepLabel>
          </HeroStep>
          <HeroStep>
            <HeroStepIcon>
              <IconCalendarEvent size={22} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepTime')}</HeroStepLabel>
          </HeroStep>
          <HeroStep>
            <HeroStepIcon>
              <IconCheckbox size={22} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepBook')}</HeroStepLabel>
          </HeroStep>
        </HeroSteps>
      </HeroCopy>
      <HeroImage src={HERO_SRC} alt="" />
    </Hero>
  );
};
