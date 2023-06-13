import { youtubeCategory } from "@/constants/general/videos";


export const getTagsFromCategories = (
  ytCategories: youtubeCategory[]
): string[] => {
  const tags: string[] = [];
  ytCategories.forEach((category) => {
    const tagsFromCategory = getTagsFromCategory(category);
    return tags.push(...tagsFromCategory);
  });
  return tags;
};

const getTagsFromCategory = (ytCategory: youtubeCategory) => {
  switch (ytCategory) {
    case "Comedy":
      return [
        `Funny`,
        `Humor`,
        `Stand-up Comedy`,
        `Sketch Comedy`,
        `Pranks`,
        `Comedy Skits`,
        `Satire`,
        `Comedy Parodies`,
        `Comedy Web Series`,
        `Comedy Movies`,
        `Funny Moments`,
      ];

    case "Education":
      return [
        `Learning`,
        `Knowledge`,
        `Educational Videos`,
        `Tutorial`,
        `Study Tips`,
        `Online Courses`,
        `Science Education`,
        `History Lessons`,
        `Math Tutorials`,
        `Language Learning`,
        `Academic Subjects`,
      ];

    case "Entertainment":
      return [
        `Entertainment News`,
        `Celebrity Gossip`,
        `Movie Reviews`,
        `TV Show Recaps`,
        `Celebrity Interviews`,
        `Red Carpet Events`,
        `Pop Culture`,
        `Music Videos`,
        `Entertainment Industry`,
        `Reality TV Shows`,
        `Award Shows`,
      ];
    case "Film & Animation":
      return [
        `Short Films`,
        `Animation`,
        `Movie Trailers`,
        `Film Reviews`,
        `Animated Shorts`,
        `CGI Animation`,
        `Film Festivals`,
        `Filmmaking Techniques`,
        `Film Analysis`,
        `Special Effects`,
        `Movie Behind the Scenes`,
      ];
    case "Gaming":
      return [
        `Gameplay`,
        `Let's Play`,
        `Game Reviews`,
        `Game Walkthroughs`,
        `Game Tips and Tricks`,
        `Game Tutorials`,
        `Game News`,
        `Esports`,
        `Gaming Commentary`,
        `Game Development`,
        `Game Mods`,
      ];
    case "Howto & Style":
      return [
        `Beauty Tutorials`,
        `Fashion Tips`,
        `Hairstyle Guides`,
        `Makeup Techniques`,
        `DIY Projects`,
        `Home Improvement`,
        `Cooking Recipes`,
        `Style Hacks`,
        `Fashion Lookbooks`,
        `Personal Development`,
        `Lifestyle Tips`,
      ];
    case "Music":
      return [
        `Music Videos`,
        `Music Performances`,
        `Song Covers`,
        `Music Genres (e.g., Pop, Rock, Hip Hop)`,
        `Music Festivals`,
        `Live Concerts`,
        `Music Production`,
        `Music Theory`,
        `Music Recommendations`,
        `Musical Instruments`,
      ];

    case "News & Politics":
      return [
        `Current Events`,
        `News Analysis`,
        `Political Commentaries`,
        `Documentary Films`,
        `Press Conferences`,
        `Interviews`,
        `Political Debates`,
        `Social Issues`,
        `Election Coverage`,
        `World News`,
      ];

    case "Nonprofits & Activism":
      return [
        `Social Causes`,
        `Charity Organizations`,
        `Humanitarian Aid`,
        `Volunteer Work`,
        `Activism`,
        `Awareness Campaigns`,
        `Fundraising Events`,
        `Nonprofit Initiatives`,
        `Advocacy`,
        `Philanthropy`,
      ];

    case "People & Blogs":
      return [
        `Vlogs`,
        `Daily Life Updates`,
        `Personal Stories`,
        `Travel Vlogs`,
        `Q&A Sessions`,
        `Opinion Videos`,
        `Product Reviews`,
        `Storytelling`,
        `Life Hacks`,
        `Relationship Advice`,
      ];

    case "Pets & Animals":
      return [
        `Cute Animals`,
        `Pet Care Tips`,
        `Animal Rescue`,
        `Funny Animal Videos`,
        `Animal Training`,
        `Exotic Pets`,
        `Wildlife Conservation`,
        `Pet Adoption`,
        `Animal Behavior`,
        `Pet Vlogs`,
      ];

    case "Science & Technology":
      return [
        `Science Experiments`,
        `Technological Innovations`,
        `Tech Reviews`,
        `Scientific Discoveries`,
        `Futuristic Concepts`,
        `Robotics`,
        `Space Exploration`,
        `AI and Machine Learning`,
        `Coding Tutorials`,
      ];
  }
  return [];
};

