export interface Category {
  id?: string;
  name: string;
  description?: string;
  active: boolean;
  isDeleted?: boolean;
  createdAt?: FirebaseFirestore.Timestamp | string;
  updatedAt?: FirebaseFirestore.Timestamp | string;
}
