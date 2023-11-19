import { AppDataSource } from '../../src/data-source';
import { Product } from '../../src/entities/product';

interface ProjectProps {
  name: string;
  content: string;
  price: number;
}

/**
 * Create a user in database.
 * @param testProduct - Product informations.
 * @returns The created product
 */
export const createTestProduct = async (testProduct: ProjectProps) => {
  const productsRepo = AppDataSource.getRepository(Product);

  const product = new Product();
  product.name = testProduct.name;
  product.content = testProduct.content;
  product.price = testProduct.price;
  product.picture = '';

  await productsRepo.save(product);
  return product;
};
