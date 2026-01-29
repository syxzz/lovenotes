import TypewriterIntro from "@/components/TypewriterIntro";

export default function Home() {
  const introText = [
    "Every moment we've shared has been a treasure, a memory etched into the fabric of our story. From the first time our eyes met to the countless adventures we've embarked upon together, each photograph captures a piece of our journey.",
    "This album is more than just a collection of images. It's a testament to our love, our laughter, and the beautiful life we're building together. Every smile, every sunset, every quiet moment—they all tell the story of us.",
    "As you browse through these memories, I hope you'll remember not just what we did, but how we felt. The warmth of your hand in mine, the sound of your laughter, the way time seems to stop when we're together.",
    "Welcome to our story. Welcome to our love. Welcome to the moments that make us, us."
  ];

  return <TypewriterIntro text={introText} typingSpeed={60} />;
}
