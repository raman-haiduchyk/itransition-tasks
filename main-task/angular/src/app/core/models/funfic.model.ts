import { Chapter } from './chapter.model';

export interface Funfic {
  id: string;
  name: string;
  author: string;
  genre: string;
  rating: number;
  scoreCount: number;
  shortDescription: string;
  chaptersCount: number;
  createdAt: string;
  tags: string[];
  chapters?: Chapter[];
}
