export interface Author {
  _id: number;
  name: string;
}
export interface StartupCardType {
  _createdAt: Date | string;
  views: number;
  author: Partial<Author>;
  _id: number;
  description: string;
  image: string;
  category: string;
  title: string;
}
