import { Droplet } from 'lucide-react';

import { Footer2 } from '@/components/ui/shadcnblocks-com-footer2';

const demoData = {
  logo: {
    title: 'Blood-O',
    url: '/#/',
    icon: <Droplet className="h-5 w-5" />,
  },
  tagline: 'Components made easy. Donations made meaningful.',
  menuItems: [
    {
      title: 'Product',
      links: [
        { text: 'Overview', url: '#' },
        { text: 'Pricing', url: '#' },
        { text: 'Marketplace', url: '#' },
        { text: 'Features', url: '#' },
        { text: 'Integrations', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', url: '#' },
        { text: 'Team', url: '#' },
        { text: 'Blog', url: '#' },
        { text: 'Careers', url: '#' },
        { text: 'Contact', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Help', url: '#' },
        { text: 'Sales', url: '#' },
        { text: 'Advertise', url: '#' },
      ],
    },
    {
      title: 'Social',
      links: [
        { text: 'Twitter', url: '#' },
        { text: 'Instagram', url: '#' },
        { text: 'LinkedIn', url: '#' },
      ],
    },
  ],
  copyright: '© 2026 Copyright. All rights reserved.',
  bottomLinks: [
    { text: 'Terms and Conditions', url: '#' },
    { text: 'Privacy Policy', url: '#' },
  ],
};

function Footer2Demo() {
  return <Footer2 {...demoData} />;
}

export { Footer2Demo };
