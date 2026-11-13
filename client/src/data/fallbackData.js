function futureDate(days, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function pastDate(days, hour = 10) {
  return futureDate(-days, hour);
}

export const activityCategories = [
  "Visiting the Sick",
  "Helping the Vulnerable",
  "Children Support",
  "Prayer Meetings",
  "Teaching the Word",
  "Charity & Community Service",
];

export const galleryCategories = ["Community Service", "Prayer", "Children", "Compassion", "Worship", "Outreach"];

export const fallbackActivities = [
  {
    id: 1,
    title: "Hospital visitation and prayer",
    description:
      "A team of volunteers visits patients, shares words of encouragement, prays with them, and offers practical support to families. This is a demonstration entry to be replaced with verified CSO activity information.",
    category: "Visiting the Sick",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(-18).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-20),
  },
  {
    id: 2,
    title: "Support for vulnerable families",
    description:
      "Volunteers distribute essential supplies and spend time with vulnerable families. This is placeholder content until the organization provides verified details.",
    category: "Helping the Vulnerable",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(-9).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-11),
  },
  {
    id: 3,
    title: "Children encouragement day",
    description:
      "A joyful day of games, songs, mentorship, and encouragement for children in the community. Placeholder demonstration activity.",
    category: "Children Support",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(-4).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-6),
  },
  {
    id: 4,
    title: "Community prayer gathering",
    description: "A time of worship, prayer, and fellowship open to the community. Placeholder demonstration activity.",
    category: "Prayer Meetings",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(6).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-2),
  },
  {
    id: 5,
    title: "Bible study and teaching",
    description:
      "Volunteers share the Word of God through a guided Bible study and discussion. Placeholder demonstration activity.",
    category: "Teaching the Word",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(13).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-1),
  },
  {
    id: 6,
    title: "Community charity drive",
    description:
      "A community collection and distribution activity supporting people in need. Placeholder demonstration activity.",
    category: "Charity & Community Service",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    activity_date: futureDate(20).slice(0, 10),
    location: "Kigali, Rwanda",
    created_at: futureDate(-1),
  },
];

export const fallbackEvents = [
  {
    id: 1,
    title: "Community prayer and worship evening",
    description:
      "Join us for an evening of prayer, worship, and encouragement. Placeholder demonstration event.",
    event_date: futureDate(10, 17),
    location: "Kigali, Rwanda",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    status: "upcoming",
    registered_count: 18,
    created_at: futureDate(-5),
  },
  {
    id: 2,
    title: "Volunteer orientation day",
    description:
      "Meet the team, learn about our activities, and discover how you can serve. Placeholder demonstration event.",
    event_date: futureDate(24, 9),
    location: "Kigali, Rwanda",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    status: "upcoming",
    registered_count: 9,
    created_at: futureDate(-3),
  },
  {
    id: 3,
    title: "Children encouragement workshop",
    description:
      "A day of mentorship, games, and encouragement for children. Placeholder demonstration event.",
    event_date: pastDate(21, 10),
    location: "Kigali, Rwanda",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    status: "completed",
    registered_count: 32,
    created_at: pastDate(35),
  },
];

export const fallbackGallery = [
  {
    id: 1,
    title: "Serving together",
    description: "Placeholder community service photograph.",
    image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    category: "Community Service",
  },
  {
    id: 2,
    title: "Prayer and fellowship",
    description: "Placeholder prayer gathering photograph.",
    image_url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    category: "Prayer",
  },
  {
    id: 3,
    title: "Hope for children",
    description: "Placeholder children support photograph.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    category: "Children",
  },
  {
    id: 4,
    title: "Hands of compassion",
    description: "Placeholder visitation photograph.",
    image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    category: "Compassion",
  },
  {
    id: 5,
    title: "Together in worship",
    description: "Placeholder worship photograph.",
    image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    category: "Worship",
  },
  {
    id: 6,
    title: "Community outreach",
    description: "Placeholder outreach photograph.",
    image_url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80",
    category: "Outreach",
  },
];

export const coreValues = [
  { title: "Faith", description: "We trust God in every step and place Him at the center of our service." },
  { title: "Love", description: "We serve people with the love of Christ, without discrimination." },
  { title: "Compassion", description: "We listen, care, and respond to the needs around us." },
  { title: "Unity", description: "We serve together as one community with one purpose." },
  { title: "Service", description: "We give our time, skills, and resources to help others." },
];
