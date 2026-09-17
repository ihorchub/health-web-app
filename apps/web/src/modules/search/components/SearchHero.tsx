import { IconCalendarEvent, IconCheckbox, IconChevronRight, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  Hero,
  HeroCopy,
  HeroImage,
  HeroStep,
  HeroStepArrow,
  HeroStepDesc,
  HeroStepIcon,
  HeroStepLabel,
  HeroSteps,
  HeroSubtitle,
  HeroTextBlock,
  HeroTitle,
} from '@/modules/search/styles';

const HERO_SRC = '/brand/hero/scr02-hero-doctor-lika.png';

export const SearchHero = () => {
  const { t } = useTranslation('search');

  return (
    <Hero>
      <HeroCopy>
        <HeroTextBlock>
          <HeroTitle>{t('hero.title')}</HeroTitle>
          <HeroSubtitle>{t('hero.subtitle')}</HeroSubtitle>
        </HeroTextBlock>
        <HeroSteps>
          <HeroStep>
            <HeroStepIcon>
              <IconSearch size={24} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepFind')}</HeroStepLabel>
            <HeroStepDesc>{t('hero.stepFindDesc')}</HeroStepDesc>
          </HeroStep>
          <HeroStepArrow aria-hidden>
            <IconChevronRight size={14} stroke={1.75} />
          </HeroStepArrow>
          <HeroStep>
            <HeroStepIcon>
              <IconCalendarEvent size={24} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepTime')}</HeroStepLabel>
            <HeroStepDesc>{t('hero.stepTimeDesc')}</HeroStepDesc>
          </HeroStep>
          <HeroStepArrow aria-hidden>
            <IconChevronRight size={14} stroke={1.75} />
          </HeroStepArrow>
          <HeroStep>
            <HeroStepIcon>
              <IconCheckbox size={24} stroke={1.75} />
            </HeroStepIcon>
            <HeroStepLabel>{t('hero.stepBook')}</HeroStepLabel>
            <HeroStepDesc>{t('hero.stepBookDesc')}</HeroStepDesc>
          </HeroStep>
        </HeroSteps>
      </HeroCopy>
      <HeroImage src={HERO_SRC} alt="" />
    </Hero>
  );
};
