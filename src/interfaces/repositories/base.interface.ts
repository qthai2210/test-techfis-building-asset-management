/**
 * Generic Repository Interface
 * T: Entity Type (e.g., AccountEntity)
 */
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
}