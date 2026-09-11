/* ────────────────────────────────────────────────────────────────
   💗  แก้ไขทุกอย่างได้ที่ไฟล์นี้ไฟล์เดียว
   ────────────────────────────────────────────────────────────────
   รูปทั้งหมดอยู่ใน  app/public/images/
   เพลงใส่ได้ 2 แบบ (ดูหัวข้อ music ด้านล่าง)
   ──────────────────────────────────────────────────────────────── */

export type Memory = {
  /** วันที่สั้น ๆ ที่โชว์บนเส้น timeline เช่น "14 Sep" */
  date: string;
  title: string;
  description: string;
  image: string;
  /** อีโมจิประจำหมุดบน timeline */
  emoji?: string;
};

export type GalleryPhoto = {
  image: string;
  caption: string;
};

export const birthday = {
  /* ─── ตัวตน ─────────────────────────────────────────────── */
  name: "Beem",
  /** ใช้โชว์ใต้คำว่า Happy Birthday */
  nickname: "My BaBy 💗",
  birthdayLabel: "14 September",
  /** เดือน/วัน (ใช้คำนวณว่าวันนี้เป็นวันเกิดหรือยัง) */
  birthdayMonth: 9,
  birthdayDay: 14,

  /* ─── รูปหลัก (Photo Reveal) ────────────────────────────── */
  mainPhoto: "/images/main-photo.jpg",

  /* ─── เพลง ──────────────────────────────────────────────────
     เลือกอย่างใดอย่างหนึ่ง (ถ้าใส่ทั้งคู่ ไฟล์ mp3 จะถูกใช้ก่อน)

     1) YouTube — วางลิงก์หรือ video id ก็ได้ เช่น
        youtube: 'https://www.youtube.com/watch?v=xxxxxxxxxxx'
        youtube: 'xxxxxxxxxxx'

     2) ไฟล์ mp3 — วางไฟล์ไว้ที่ app/public/music/birthday-song.mp3
        แล้วใส่  file: '/music/birthday-song.mp3'
     ──────────────────────────────────────────────────────────── */
  music: {
    youtube: "https://www.youtube.com/watch?v=nl62hhiBMOM",
    file: "",
    title: "Our Song",
    /** ระดับเสียงตอนเริ่ม 0–1 */
    volume: 0.55,
  },

  /* ─── ข้อความบนซองจดหมายแรก ────────────────────────────── */
  envelope: {
    to: "To: My Special Person 💗",
    subtitle: "14 September",
    cta: "Open Your Letter 💌",
  },

  /* ─── ข้อความหลังเปิดซอง (ก่อนนับถอยหลัง) ──────────────── */
  countdownIntro: "Something special is waiting for you...",
  countdownOutro: "Ready? 💗",

  /* ─── Photo Reveal ─────────────────────────────────────────── */
  photoReveal: {
    line1: "Today is all about you.",
    line2: "Happy Birthday 💗",
    line3: "14 September",
  },

  /* ─── ข้อความคั่นก่อนเข้า Timeline ─────────────────────── */
  transitionLines: [
    "Before we celebrate...",
    "Let's look back at some little moments. ✨",
  ],

  /* ─── Timeline: Our Little Story ───────────────────────── */
  timelineTitle: "Our Little Story",
  timelineSubtitle: "เรื่องเล็ก ๆ ที่ไม่เคยเล็กเลยสำหรับเรา",

  timeline: [
    {
      date: "The Beginning",
      title: "จุดเริ่มต้นของเรา",
      description:
        "วันแรกที่เราได้รู้จักกัน วันที่ยังไม่รู้เลยว่าคนคนนี้จะสำคัญกับเราขนาดนี้ ✨",
      image: "/images/memory-01.jpg",
      emoji: "✨",
    },
    {
      date: "Our First Memory",
      title: "ความทรงจำแรกของเรา 🤍",
      description:
        "ครั้งแรกที่ได้ออกไปด้วยกัน จำได้ทุกอย่าง ทั้งที่ตอนนั้นก็ไม่ได้ตั้งใจจะจำ 😜",
      image: "/images/memory-02.jpg",
      emoji: "💫",
    },
    {
      date: "Drunk mode 🤪",
      title: "พากันเมา 🍻",
      description:
        "ลมทะเล เสียงคลื่น และเสียงหัวเราะของเธอ วันนั้นเป็นวันที่ดีมากจริง ๆ",
      image: "/images/memory-03.jpg",
      emoji: "🌊",
    },
    {
      date: "A Favorite Moment",
      title: "ช่วงเวลาที่ชอบที่สุด 🍻",
      description:
        "ไม่ต้องไปไหนไกล แค่ได้นั่งคุยกันนาน ๆ ก็เป็นวันที่ดีที่สุดของเราแล้ว (หูชาเทอพูดไม่หยุดเลย 😆)",
      image: "/images/memory-04.jpg",
      emoji: "🍻",
    },
    {
      date: "All The Little Things",
      title: "เรื่องเล็ก ๆ ทุกเรื่อง",
      description:
        "รอยยิ้ม ข้อความก่อนนอน งอนแล้วง้อ ทุกอย่างรวมกันเป็นโกโก้ครั้น เอ้ย รวมกันเป็นเรา 💗",
      image: "/images/memory-05.jpg",
      emoji: "💗",
    },
    {
      date: "14 Sep",
      title: "Your Special Day 🎂",
      description: "The day someone very special\ncame into this world.",
      image: "/images/memory-06.jpg",
      emoji: "🎂",
    },
  ] as Memory[],

  /* ─── Gallery: Little Moments ──────────────────────────── */
  galleryTitle: "Little Moments",
  gallerySubtitle: "เก็บไว้ทุกรูป เพราะทุกรูปมีเธออยู่ในนั้น",

  gallery: [
    { image: "/images/memory-01.jpg", caption: "วันที่ไม่ธรรมดาเลยสักนิด" },
    { image: "/images/memory-02.jpg", caption: "ยิ้มแบบนี้แหละที่ชอบที่สุด" },
    { image: "/images/memory-03.jpg", caption: "ทะเลกับเธอ 🌊" },
    { image: "/images/memory-04.jpg", caption: "แก้วนี้เพื่อเรานะ 🍻" },
    { image: "/images/memory-05.jpg", caption: "อยู่ด้วยกันแล้วสบายใจ 💝" },
    { image: "/images/memory-06.jpg", caption: "วันธรรมดาที่พิเศษ" },
    { image: "/images/memory-07.jpg", caption: "เก็บไว้ในใจตลอดไป" },
    { image: "/images/memory-08.jpg", caption: "ขอบคุณที่อยู่ตรงนี้" },
    { image: "/images/karn.jpg", caption: "และอีกหลาย ๆ วันข้างหน้า 💗" },
    { image: "/images/memory-09.jpg", caption: "และอีกหลาย ๆ วันข้างหน้า 💗" },
  ] as GalleryPhoto[],

  /* ─── Love Letter ──────────────────────────────────────── */
  letter: {
    lead: ["And now...", "A little message for you."],
    cta: "Read My Letter 💌",
    /** แต่ละ item = 1 ย่อหน้า (ขึ้นทีละบรรทัดแบบนุ่ม ๆ) */
    body: [
      "ถึงคนพิเศษของเรา 💗",
      "สุขสันต์วันเกิดนะ",
      "ขอให้ปีนี้เป็นปีที่เต็มไปด้วย\nเรื่องดี ๆ รอยยิ้ม และความสุข",
      "ขอให้ทุกสิ่งที่ตั้งใจไว้\nค่อย ๆ กลายเป็นจริง",
      "ขอบคุณสำหรับทุกช่วงเวลาที่เราได้มีร่วมกัน",
      "ไม่ว่าอนาคตจะเป็นอย่างไร ดีใจที่ได้เจอคับ 🤍",
      "🎉 Happy Birthday 🎂",
    ],
    signature: "🤍 Made with Love 💗",
  },

  /* ─── Birthday Cake ────────────────────────────────────── */
  cake: {
    lead: "One Last Thing...",
    wishTitle: "Make a Wish ✨",
    cta: "Blow the Candles 🎂",
    /** จำนวนเทียน (แนะนำ 3–7 เล่ม จะสวยที่สุด) */
    candles: 5,
    afterBlow: ["Make a wish... ✨", "I hope it comes true. 💗"],
  },

  /* ─── Final Message ────────────────────────────────────── */
  finale: {
    title: "🎉 Happy Birthday 🎉",
    subtitle: "💖 My Special Person 💗",
    date: "14 September",
    lines: [
      "May your days be filled with\nsmiles, happiness,\nand beautiful moments.",
      "You deserve all the good things\nin the world. 💗",
    ],
    signature: "🤍 Made with Love 💗",
    replay: "Replay The Surprise ✨",
  },

  /* ─── Easter Egg ───────────────────────────────────────── */
  easterEgg: {
    /** ต้องกดหัวใจที่ลอยอยู่กี่ครั้ง */
    tapsRequired: 14,
    message: "You found my little secret. 💗",
    submessage: "เธอเก่งจัง หาเจอด้วย 🥹",
  },
} as const;

export type BirthdayConfig = typeof birthday;
