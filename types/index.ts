export interface Video {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: number;
  visibility: "private" | "public";
  createdAt: Date;
  updatedAt: Date;
}
