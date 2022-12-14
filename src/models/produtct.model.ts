import { Pool, ResultSetHeader } from 'mysql2/promise';
import Product from '../interface/product.interface';

export default class ProductModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<Product[]> {
    const result = await this.connection
      .execute('SELECT * FROM Trybesmith.Products;');
    const [rows] = result;
    return rows as Product[];
  }

  public async getByOrderId(orderId: number): Promise<Product[]> {
    const result = await this.connection
      .execute('SELECT * FROM Trybesmith.Products WHERE orderId =?;', [orderId]);
    const [rows] = result;
    return rows as Product[];
  }

  public async add(product: Product): Promise<Product> {
    const { name, amount } = product; 
    const result = await this.connection
      .execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.Products (name, amount) VALUE (?, ?);',
      [name, amount],
    );
    const [dataInserted] = result;
    const { insertId } = dataInserted;
    return {
      id: insertId,
      ...product,
    };
  }
}