// Types for Site Settings from CMS
export interface BranchAddress {
    province: string;
    address: string;
    phone: string;
    mapUrl?: string;
}

export interface Branch {
    regionName: string;
    addresses: BranchAddress[];
}

// Colors Section Types
export interface ColorsSection {
    primaryColor: string;
    header: {
        bgColor: string;
        textColor: string;
        hoverColor: string;
    };
    footer: {
        bgColor: string;
        textColor: string;
        mutedColor: string;
    };
    pageHeader: {
        bgColor: string;
        textColor: string;
    };
    buttons: {
        primaryBg: string;
        primaryText: string;
        secondaryBg: string;
        secondaryText: string;
    };
    cards: {
        bgColor: string;
        borderColor: string;
    };
}

export interface SiteSettings {
    general_section: {
        siteName: string;
        siteTagline: string;
        siteDescription: string;
        siteKeywords?: string[];
        siteUrl: string;
    };
    images_section: {
        logo: string;
        logoAlt: string;
        favicon: string;
        ogImage?: string;
    };
    contact_section: {
        phone: string;
        phoneDisplay: string;
        email: string;
        address?: string;
    };
    branches: Branch[];
    social_section: {
        facebookUrl?: string;
        facebookUsername?: string;
        messengerUrl?: string;
        youtubeUrl?: string;
        youtubeChannelName?: string;
        tiktokUrl?: string;
        tiktokUsername?: string;
        zaloPhone?: string;
    };
    seo_section: {
        googleVerification?: string;
        bingVerification?: string;
        themeColor: string;
    };
    organization_section: {
        organizationName: string;
        organizationType: 'LocalBusiness' | 'Corporation' | 'Organization';
        foundingDate?: string;
        vatNumber?: string;
    };
    colors_section?: ColorsSection;
}

// Default settings for fallback
export const defaultSiteSettings: SiteSettings = {
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

