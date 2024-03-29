import { BookPlus, Clock, Mic, Scroll, ScrollText } from "lucide-react";

export const dashboard = [
  {
    name: "Chat with a therapist App",
    description:
      "This web application provides users with the convenience of accessing professional therapy services from the comfort of their home.",
    source_code_link: "/conversations",
    picture: "/assets/images/chatpic2.png",
    Icon: Mic,
    construction: false,
  },
  {
    name: "Journaling App",
    description:
      "Embrace self-reflection and personal growth with our intuitive journaling app. Seamlessly capture your thoughts and emotions all in one place. ",

    source_code_link: "/journal",
    picture: "/assets/images/journal.png",
    Icon: BookPlus,
    construction: true,
  },
  {
    name: "Meditation App",
    description:
      "Our app is designed to help you manage stress, improve focus, and foster a deeper connection with yourself.",

    source_code_link: "/meditate",
    picture: "/assets/images/meditate2.png",
    Icon: Clock,
    construction: true,
  },
  {
    name: "To-Do List App",
    description:
      "Stay organized, stay on top of your tasks, and conquer your day with our efficient to-do list app.",
    source_code_link: "/todo",
    picture: "/assets/images/todo.png",
    Icon: ScrollText,
    construction: true,
  },
];

export const listItems = [
  {
    iconPath: "/assets/images/hero/convenient.png",
    title: "Convenient",
    // and accessible
    subtitle:
      "Engage in therapy sessions and wellness activities anywhere, from the comfort of your own device, eliminating the need for physical appointments or travel.",
  },
  {
    iconPath: "/assets/images/hero/paperwork.png",
    title: "No Insurance Hassles",
    subtitle:
      "Skip the complexities of insurance paperwork and claims—our service offers transparent pricing and direct payment options, ensuring a hassle-free experience for users.",
  },
  {
    iconPath: "/assets/images/hero/affordable.png",
    title: "Affordable Pricing",
    subtitle:
      "Enjoy therapy sessions and access to the full range of wellness features at an affordable price point, making mental health support accessible to a wider audience.",
  },
  {
    iconPath: "/assets/images/hero/clock.png",
    title: "24/7 Availability",
    subtitle:
      "Access therapy and wellness tools whenever you need them, as our service is available round the clock, catering to different time zones and accommodating diverse schedules.",
  },
];
