export interface LocalizedBabPackItem {
  numberLabel: string;
  title: string;
  subtitle: string;
}

export interface LocalizedHadithPackItem {
  translation: string;
  lessons: string[];
  contextStory?: {
    title: string;
    summary: string;
  };
  footnotes: Record<string, string>;
}

export interface HadithLanguagePack {
  babs: Record<number, LocalizedBabPackItem>;
  hadiths: Record<number, LocalizedHadithPackItem>;
}
