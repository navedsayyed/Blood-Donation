import type { ReactNode } from 'react';
import { Droplet } from 'lucide-react';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title: string;
    icon?: ReactNode;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    title: 'Blood-O',
    url: '#',
    alt: 'Blood-O',
  },
  tagline = 'Saving lives, one donation at a time.',
  menuItems = [
    {
      title: 'Donate',
      links: [
        { text: 'Register as Donor', url: '/#/register-donor' },
        { text: 'Donation Camps', url: '/#/donation-camps' },
        { text: 'Eligibility Guide', url: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Home', url: '/#/' },
        { text: 'Login', url: '/#/login' },
        { text: 'Profile', url: '/#/profile' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Blood Types', url: '#' },
        { text: 'Donation Process', url: '#' },
        { text: 'FAQs', url: '#' },
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
  copyright = '© 2026 Blood-O. All rights reserved.',
  bottomLinks = [
    { text: 'Terms and Conditions', url: '#' },
    { text: 'Privacy Policy', url: '#' },
  ],
}: Footer2Props) => {
  return (
    <section className="bg-zinc-950 py-16 text-white md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-3 lg:justify-start">
                <a href={logo.url} className="inline-flex items-center justify-center">
                  {logo.icon ? (
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-red-200">
                      {logo.icon}
                    </span>
                  ) : logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.alt || logo.title}
                      title={logo.title}
                      className="h-11 w-11 rounded-full bg-white object-cover shadow-sm ring-1 ring-red-200"
                    />
                  ) : (
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-red-200">
                      <Droplet className="h-5 w-5" />
                    </span>
                  )}
                </a>
                <p className="text-3xl font-bold tracking-tight text-white">{logo.title}</p>
              </div>
              <p className="mt-4 text-base font-medium text-zinc-300">{tagline}</p>
            </div>

            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="space-y-3 text-zinc-400">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium transition-colors hover:text-red-300">
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-zinc-800 pt-6 text-sm font-medium text-zinc-400 md:mt-16 md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex flex-wrap gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline transition-colors hover:text-red-300">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
