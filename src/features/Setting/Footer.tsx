'use client';

import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import GuideModal from '@/components/GuideModal';
import GuideVideo from '@/components/GuideVideo';
import { BRANDING_NAME } from '@/const/branding';
import { GITHUB, GITHUB_ISSUES } from '@/const/url';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { isOnServerSide } from '@/utils/env';

const useStyles = createStyles(
  ({ css, token }) => css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
);

export const LayoutSettingsFooterClassName = 'settings-layout-footer';

const Footer = memo<PropsWithChildren>(() => {
  return null;
});

Footer.displayName = 'SettingFooter';

export default Footer;
