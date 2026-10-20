const sequelize = require('./database');
const Author = require('./models/Author');
const Book = require('./models/Book');

// Один автор может иметь несколько книг.
Author.hasMany(Book, {
  foreignKey: 'authorId',
  as: 'books',
});

// Каждая книга принадлежит одному автору.
Book.belongsTo(Author, {
  foreignKey: 'authorId',
  as: 'author',
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно.');

    await sequelize.sync({ force: true });
    console.log('Таблицы Author и Book созданы.');

    const author = await Author.create({
      name: 'Лев Толстой',
      country: 'Россия',
    });

    await author.createBook({
      title: 'Война и мир',
      year: 1869,
      genre: 'Роман',
    });

    await author.createBook({
      title: 'Анна Каренина',
      year: 1877,
      genre: 'Роман',
    });

    console.log('Автор и две книги добавлены.');

    const booksCount = await author.countBooks();
    console.log(`Количество книг автора: ${booksCount}`);

    const authors = await Author.findAll({
      include: [
        {
          model: Book,
          as: 'books',
        },
      ],
    });

    console.log('\nАвторы и их книги:');

    console.log(
      JSON.stringify(
        authors.map((item) => item.toJSON()),
        null,
        2
      )
    );
  } catch (error) {
    console.error('Ошибка:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log('Соединение с базой данных закрыто.');
  }
}

main();