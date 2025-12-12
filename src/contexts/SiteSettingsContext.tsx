import React, { createContext, useContext, ReactNode } from 'react';
import type { SiteSettings, Branch } from '@/types/siteSettings';

// Default values (used as fallback if context is not provided)
const defaultSiteSettings: SiteSettings = {
    general_section: {
        siteName: 'Soosan Motor',
        siteTagline: 'Chuyên cung cấp xe tải chất lượng',
        siteDescription: 'Chuyên cung cấp xe tải, đầu kéo, rơ moóc các loại.',
        siteKeywords: [],
        siteUrl: 'https://soosanmotor.com',
    },
    images_section: {
        logo: 'https://cdn.soosanmotor.com/soosanmotor.com_logo_Soosan.webp',
        logoAlt: 'Soosan Motor Logo',
        favicon: '/favicon.ico',
        ogImage: '/og-default.jpg',
    },
    contact_section: {
        phone: '0815555528',
        phoneDisplay: '0815555528',
        email: 'sales@soosanmotor.com',
        address: '',
    },
    branches: [],
    social_section: {},
    seo_section: {
        themeColor: '#dc2626',
    },
    organization_section: {
        organizationName: 'SOOSAN VINA MOTOR',
        organizationType: 'LocalBusiness',
    },
    colors_section: {
        primaryColor: '#D84315',
        header: {
            bgColor: '#FFFFFF',
            textColor: '#1F2937',
            hoverColor: '#D84315',
        },
        footer: {
            bgColor: '#111827',
            textColor: '#FFFFFF',
            mutedColor: '#9CA3AF',
        },
        pageHeader: {
            bgColor: '#1F2937',
            textColor: '#FFFFFF',
        },
        buttons: {
            primaryBg: '#D84315',
            primaryText: '#FFFFFF',
            secondaryBg: '#F3F4F6',
            secondaryText: '#1F2937',
        },
        cards: {
            bgColor: '#FFFFFF',
            borderColor: '#E5E7EB',
        },
    },
};

// Context
const SiteSettingsContext = createContext<SiteSettings>(defaultSiteSettings);

// Provider component
interface SiteSettingsProviderProps {
    children: ReactNode;
    settings?: Partial<SiteSettings>;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children, settings }) => {
    // Merge provided settings with defaults
    const mergedSettings: SiteSettings = {
        general_section: { ...defaultSiteSettings.general_section, ...settings?.general_section },
        images_section: { ...defaultSiteSettings.images_section, ...settings?.images_section },
        contact_section: { ...defaultSiteSettings.contact_section, ...settings?.contact_section },
        branches: settings?.branches || defaultSiteSettings.branches,
        social_section: { ...defaultSiteSettings.social_section, ...settings?.social_section },
        seo_section: { ...defaultSiteSettings.seo_section, ...settings?.seo_section },
        organization_section: { ...defaultSiteSettings.organization_section, ...settings?.organization_section },
        colors_section: settings?.colors_section ? {
            primaryColor: settings.colors_section.primaryColor || defaultSiteSettings.colors_section!.primaryColor,
            header: { ...defaultSiteSettings.colors_section!.header, ...settings.colors_section.header },
            footer: { ...defaultSiteSettings.colors_section!.footer, ...settings.colors_section.footer },
            pageHeader: { ...defaultSiteSettings.colors_section!.pageHeader, ...settings.colors_section.pageHeader },
            buttons: { ...defaultSiteSettings.colors_section!.buttons, ...settings.colors_section.buttons },
            cards: { ...defaultSiteSettings.colors_section!.cards, ...settings.colors_section.cards },
        } : defaultSiteSettings.colors_section,
    };

    return (
        <SiteSettingsContext.Provider value={mergedSettings}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

// Hook to use settings
export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    return context;
};

// Convenience hooks for specific sections
export const useContactInfo = () => {
    const { contact_section } = useSiteSettings();
    return contact_section;
};

export const useImageSettings = () => {
    const { images_section } = useSiteSettings();
    return images_section;
};

export const useSocialLinks = () => {
    const { social_section } = useSiteSettings();
    return social_section;
};

export const useBranches = (): Branch[] => {
    const { branches } = useSiteSettings();
    return branches;
};

export const useOrganization = () => {
    const { organization_section } = useSiteSettings();
    return organization_section;
};

export const useColors = () => {
    const { colors_section } = useSiteSettings();
    return colors_section || defaultSiteSettings.colors_section!;
};

export default SiteSettingsContext;
