import { languageLevels } from "../general/languages";

export type ManualLanguageOption = {
  level: (typeof languageLevels)[number];
  description: string;
  bulletPoints: string[];
};
export const ManualLanguageOptions: ManualLanguageOption[] = [
  {
    level: "A1",
    description: `Level A1 corresponds to basic users of the language, i.e. those able to communciate in everyday situations with commonly-used expressions and elementary vocabulary.`,
    bulletPoints: [
      `He/she can understand and use very frequently-used everyday expressions as well as simple phrases to meet immediate needs.`,
      `He/she can introduce him/herself and others and can ask and answer questions about personal details such as where he/she lives, things he/she has and people he/she knows`,
      `He/she can interact in a simple way provided the other person talks slowly and clearly and is prepared to cooperate.`,
    ],
  },
  {
    level: "A2",
    description: `Level A2 corresponds to basic users of the language, i.e. those able to communciate in everyday situations with commonly-used expressions and elementary vocabulary`,
    bulletPoints: [
      `He/she can understand sentences and frequently-used expressions related to the areas of experience most immediately relevant to him/her (e.g. very basic personal and family information, shopping, places of interest, employment, etc.).`,
      `He/she can communicate in simple, everyday tasks requiring no more than a simple and direct exchange of information on familiar and routine matters.`,
      `He/she can describe in simple terms aspects of his/her past, environment and matters related to his/her immediate needs.`,
    ],
  },
  {
    level: "B1",
    description: `Level B1 corresponds to independent users of the language, i.e. those who have the necessary fluency to communicate without effort with native speakers.`,
    bulletPoints: [
      `Is able to understand the main points of clear texts in standard language if they are about topics with which they are familiar, whether in work, study or leisure contexts.`,
      `Can cope with most of the situations that might arise on a trip to areas where the language is used.`,
      `Is able to produce simple, coherent texts about topics with which they are familiar or in which they have a personal interest.`,
      `Can describe experiences, events, wishes and aspirations, as well as briefly justifying opinions or explaining plans.`,
    ],
  },
  {
    level: "B2",
    description: `Level B2 corresponds to independent users of the language, i.e. those who have the necessary fluency to communicate without effort with native speakers.`,
    bulletPoints: [
      `Can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in their field of specialization.`,
      `Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party.`,
      `Can produce clear, detailed text on a wide range of subjects and explain a viewpoint on a topical issue giving the advantages and disadvantages of various options.`,
    ],
  },
  {
    level: "C1",
    description: `Level C1 corresponds to proficient users of the language, i.e. those able to perform complex tasks related to work and study.`,
    bulletPoints: [
      `He/she can understand a wide range of more demanding, longer texts, and recognise implicit meaning in them.`,
      `He/she can express him/herself fluently and spontaneously without much obvious searching for the right expression.`,
      `He/she can use language flexibly and effectively for social, academic and professional purposes. He/she can produce clear, well-structured, detailed text on complex subjects, showing correct use of organisational patterns, connectors and cohesive devices.`,
    ],
  },
  {
    level: "C2",
    description: `Level C2 corresponds to proficient users of the language, i.e. those able to perform complex tasks related to work and study.`,
    bulletPoints: [
      `He/she can understand with ease practically everything he/she hears or reads. `,
      `He/she can summarise information and arguments from different spoken and written sources, and present them coherently and concisely. `,
      `He/she can express him/herself spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations.`,
    ],
  },
];
