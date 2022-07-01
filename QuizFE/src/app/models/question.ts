export interface Question {
  id: number;
  content: string;
  options: Option[];
}

export interface Option {
  content: string;
  isCorrect: boolean;
  count: number;
}

export interface Exam {
  id: number,
  name: string,
  time: number,
  isActive: boolean,
  questions: Question[]
}
