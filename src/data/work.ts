// Portfolio content, taken from syeedfahim.netlify.app (Syeed's own site). Real facts only.

export const PROFILE = {
  name: 'Syeed Hossain Fahim',
  role: 'AI Visual Storyteller & Content Developer',
  location: 'Dhaka, Bangladesh',
  email: 'sdfahim4200@gmail.com',
  phone: '+880 1831 141481',
  phoneHref: 'tel:+8801831141481',
  whatsapp: 'https://wa.me/8801831141481',
  linkedin: 'https://www.linkedin.com/in/syeedfahim/',
  instagram: 'https://www.instagram.com/syeed_fahim/',
  behance: 'https://www.behance.net/gallery/252178119/Aiyaan-Perfume-Campaign-Fragrance-Advertising-Design',
};

export type WorkItem = { title: string; tag: string; img: string; href: string; w: number; h: number };

export const GALLERY: WorkItem[] = [
  { title: 'Fragrance Attar Advertising', tag: 'Advertising · Product', img: '/work/attar-fragrance.webp', href: 'https://www.behance.net/gallery/252178119/Aiyaan-Perfume-Campaign-Fragrance-Advertising-Design', w: 1200, h: 939 },
  { title: 'AI-Assisted Shoe Advertising', tag: 'AI · Advertising', img: '/work/ai-shoe-ad.webp', href: 'https://www.behance.net/gallery/249976821/Brooks-Glycerin-Max-2-Concept-Campaign', w: 1200, h: 1600 },
  { title: 'Book Storytelling Campaign', tag: 'Social media · Banner', img: '/work/book-campaign.webp', href: 'https://www.behance.net/gallery/242981181/Creative-Book-Promotion-Social-Media-Advertising', w: 1200, h: 631 },
  { title: 'Libasul Haya Polo Campaign', tag: 'Fashion · E-commerce', img: '/work/libasul-haya-polo.webp', href: 'https://www.behance.net/gallery/245717705/Polo-Shirt-Social-Media-Campaign-for-Libasul-Haya', w: 1200, h: 1500 },
  { title: 'Wallframes — Spiritual Minimalism', tag: 'Branding · Social', img: '/work/wallframes.webp', href: 'https://www.behance.net/gallery/252287223/Wallframes-Social-Media-Design-Spiritual-Minimalism', w: 1200, h: 939 },
  { title: 'Connecting Disorder Posters', tag: 'Digital · Awareness', img: '/work/connecting-disorder.webp', href: 'https://www.behance.net/gallery/199473481/Social-Media-Day-Banner-Connecting-Disorders', w: 1200, h: 938 },
];

export const THUMBNAILS = ['/work/thumb-1.webp', '/work/thumb-2.webp', '/work/thumb-3.webp', '/work/thumb-4.webp'];
export const THUMB_LINK = 'https://www.behance.net/gallery/253848913/ITS-Academy-Educational-YouTube-Thumbnail-Design';

export const VIDEOS = ['XMk9lBTKtvU', '_LYxnJ2IvoQ', '5GnEbNhKqW0', 'wyFkxbF5IBo'];

export const BRANDS = [
  { name: 'Aiyaan', tag: 'Home decor · Creative direction', img: '/work/brand-aiyaan.webp', href: 'https://www.facebook.com/shopaiyaan', text: 'Complete brand identity for a home decor company, where I work as Creative Director.' },
  { name: 'Frizo', tag: 'Branding · Logo', img: '/work/brand-frizo.webp', href: 'https://www.facebook.com/frizobd', text: 'A modern, refreshing identity built on clean typography and a vibrant palette.' },
  { name: 'Ecommetrix', tag: 'Corporate · Visual identity', img: '/work/brand-ecommetrix.webp', href: 'https://www.facebook.com/ecommetrix/', text: 'Complete visual identity for an e-commerce solutions provider.' },
  { name: '5menstudio', tag: 'Studio branding', img: '/work/brand-5menstudio.webp', href: 'https://www.facebook.com/fivemenstudiobd', text: 'Logo and identity for a production house — minimal and bold.' },
  { name: 'Future IT Farm', tag: 'IT firm · Web services', img: '/work/brand-future-it.webp', href: 'https://www.behance.net/gallery/229444895/Future-IT-Brand-Identity-Design', text: 'Sleek corporate identity for an IT and web-services provider.' },
  { name: 'Flyfanush', tag: 'E-commerce · Branding', img: '/work/brand-flyfanush.webp', href: 'https://www.facebook.com/flyfanush', text: 'Minimal, modern identity for an e-commerce platform.' },
  { name: 'Kothabondhu', tag: 'Teletherapy · Health', img: '/work/brand-kothabondhu.webp', href: 'https://www.facebook.com/kothabondhuDU', text: 'Identity for a teletherapy service supporting people with communication problems.' },
];

export const SERVICES = [
  { title: 'AI ad creatives', text: 'Product and campaign visuals made with AI and finished by hand — perfume, fashion, footwear and more.', img: '/work/attar-fragrance.webp' },
  { title: 'Social media campaigns', text: 'Carousels, banners and launch posts that stop the scroll and stay on brand.', img: '/work/book-campaign.webp' },
  { title: 'Brand identity', text: 'Logos and visual systems for shops, studios and services — from scratch.', img: '/work/brand-aiyaan.webp' },
  { title: 'YouTube thumbnails', text: 'Bold, readable thumbnails in Bangla and English that earn the click.', img: '/work/thumb-2.webp' },
  { title: 'Motion & storytelling', text: 'Motion graphics and story-led videos with After Effects, CapCut and AI video tools.', img: '/work/wallframes.webp' },
];

export const VALUES = ['Halal-first visuals', 'No music', 'No female faces', 'People from behind or as silhouettes'];

export const EXPERIENCE = [
  { when: 'Present', role: 'Content Developer', org: 'lustmanager.com · Remote', now: true, points: ['Developing engaging digital content and creative strategies.', 'Producing AI-assisted media, graphics and marketing materials.'] },
  { when: "Mar '21 — Present", role: 'Creative Director & Founder', org: 'Aiyaan — Home Decor · Dhaka', now: true, points: ['Founded and led a home decor brand, managing all creative direction.', 'Overseeing product packaging and social media campaigns.'] },
  { when: "Aug '24 — Jun '26", role: 'Graphics Designer', org: 'Wafilife — E-commerce · Dhaka', points: ['Promotional banners, product visuals and campaign creatives.', 'AI-assisted video content and motion graphics for social media.'] },
  { when: "Jan '20 — Jan '22", role: 'Junior Graphics Designer', org: 'Connecting Disorder · Youth voluntary org', points: ['Awareness posters, digital graphics and event materials supporting people with autism and communication disorders.'] },
];

export const TOOLS = ['Photoshop', 'Illustrator', 'After Effects', 'CapCut', 'ChatGPT', 'Gemini', 'Google Flow', 'Midjourney', 'Magnific', 'NotebookLM'];

export const EDUCATION = [
  { when: "Jan '25 — Jan '26 · Ongoing", title: 'MSS in Communication Disorders', org: 'University of Dhaka' },
  { when: "Jan '20 — Jan '24", title: 'BSS in Communication Disorders', org: 'University of Dhaka' },
  { when: '2019', title: 'HSC — Science · GPA 5.00', org: 'Govt Science College, Farmgate' },
  { when: '2017', title: 'SSC — Science · GPA 5.00', org: 'Govt Science School, Farmgate' },
];
