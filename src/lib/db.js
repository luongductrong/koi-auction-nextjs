import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false, // Không cần mã hóa cho kết nối cục bộ
    enableArithAbort: true,
  },
};

export async function dbConnect() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to local SQL Server'); // In ra thông báo khi kết nối thành công
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error); // In lỗi nếu kết nối thất bại
    throw new Error('Database connection failed');
  }
}

// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mssql',
//   dialectOptions: {
//     options: {
//       encrypt: false,
//     },
//   },
// });

// const dbConnect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// export { dbConnect, sequelize };
