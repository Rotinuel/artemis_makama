// Banner images for the News + Events page.
// Free-to-use photos from Unsplash (unsplash.com/license — free for
// commercial use, no permission needed). Swap or add any image URL,
// including your own project photos in /public (e.g. '/51.jpg').

const u = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=75`

export const NEWS_HERO_SLIDES = [
    { src: u('photo-1541888946425-d81bb19240f5'), alt: 'Construction site' },
    { src: u('photo-1487958449943-2429e8be8625'), alt: 'Contemporary architecture' },
    { src: u('photo-1504307651254-35680f356dfd'), alt: 'Construction in progress' },
    { src: u('photo-1503387762-592deb58ef4e'), alt: 'Architectural drawings' },
    { src: u('photo-1486406146926-c627a92ad1ab'), alt: 'High-rise buildings' },
    { src: u('photo-1581094794329-c8112a89af12'), alt: 'Engineering at work' },
]
