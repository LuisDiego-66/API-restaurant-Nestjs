import { CategoryStatus } from '../../categories/enum/category-status.enum';
import { SectionStatus } from '../../sections/enum/section-status.enum';

interface SeedRol {
  rolName: string;
}

interface SeedSection {
  name: string;
  description: string;
  status: SectionStatus;
  startTime: number;
  endTime: number;
}

interface SeedCategories {
  name: string;
  urlImage: string;
  status: CategoryStatus;
  startTime: number;
  endTime: number;
}

interface SeedData {
  rol: SeedRol[];
  sections: SeedSection[];
  categories: SeedCategories[];
}

export const initialData: SeedData = {
  rol: [{ rolName: 'user' }],

  sections: [
    {
      name: 'general',
      description: 'description',
      endTime: 0,
      startTime: 0,
      status: SectionStatus.ENABLED,
    },
  ],

  categories: [
    {
      name: 'general',
      urlImage: ' ',
      endTime: 0,
      startTime: 0,
      status: CategoryStatus.ENABLED,
    },
  ],
};
