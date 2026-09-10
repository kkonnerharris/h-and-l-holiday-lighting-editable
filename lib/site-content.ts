import settings from '../content/site.json';
import homeData from '../content/home.json';
import galleryData from '../content/gallery.json';
import contact from '../content/contact.json';

const home: { headline: string; introduction: string; image: string; imageDescription?: string; buttonText: string } = homeData;
const gallery: { photos: { image: string; alt?: string }[] } = galleryData;

const [firstLine, ...remainingLines] = home.headline.split(/\r?\n/);
const digits = contact.phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const phoneDisplay = digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : contact.phone;

const site = {
  ...settings,
  contact: { ...contact, phoneDisplay },
  hero: { image: home.image, alt: home.imageDescription || 'Holiday lighting on a home' },
  projects: gallery.photos.map(photo => ({ ...photo, alt: photo.alt || 'Holiday lighting project' })),
  copy: {
    ...settings.copy,
    top: {
      text01: firstLine,
      text02: remainingLines.join(' '),
      text03: home.introduction,
      text04: home.buttonText,
      text05: 'See recent homes ',
      text06: 'Discover',
    },
  },
};

export default site;
