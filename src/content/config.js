import { defineCollection, z } from 'astro:content';

const pollutionCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    backgroundImage: z.string().optional(),
    pollutionType: z.enum([
      'air', 'water', 'noise', 'electromagnetic', 'light', 
      'littering', 'plastic', 'soil', 'radioactive', 'thermal', 'visual'
    ]),
    published: z.boolean().default(true)
  })
});

export const collections = {
  'pollution': pollutionCollection
};
