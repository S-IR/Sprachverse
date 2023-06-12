import { retext } from "retext";
import english from "retext-english";
import retextKeywords from "retext-keywords";
import retextPos from "retext-pos";
import { toString } from "nlcst-to-string";

export const extractKeywordsFromText = async (
  text: string
): Promise<string[] | undefined> => {
  let extractedKeywords: string[] = await new Promise((resolve, reject) => {
    retext()
      .use(english)
      .use(retextPos)
      .use(retextKeywords, { maximum: 40 })
      .process(text, (err, file) => {
        if (err) reject(err);
        if (file === undefined || file.data.keywords === undefined) return [];
        let keywords = file.data.keywords
          .filter((kw: any) => kw.matches[0].node !== undefined)
          .map((kw) => toString(kw.matches[0].node));
        resolve(keywords);
      });
  });
  return extractedKeywords;
};
