import initSqlJs from './sql-asm.js'

class SqlDB {
  static _db;

  static get inputProperties() {
    return [
      '--sql-query'
    ]
  }

  static async db() {
    if (SqlDB._db) {
      return SqlDB._db
    }

    //console.log(sqlWasm.initSqlJs)
    const SQL = await initSqlJs({
      locateFile: file => `./${file}`,
    })

    SqlDB._db = new SQL.Database()

    SqlDB._db.run("CREATE TABLE geniuses (name TEXT NOT NULL)")
    SqlDB._db.run(
      "INSERT INTO geniuses VALUES (?), (?), (?), (?)",
      ['Nico', 'The Fresh Prince of Bel Air', 'Einstein', 'Noel Edmonds']
    )

    return SqlDB._db
  }

  async paint(ctx, geom, properties) {
    const gradient = ctx.createLinearGradient(0, 300, geom.width, geom.height)
    gradient.addColorStop(0, '#dd3e54')
    gradient.addColorStop(1, '#6be585')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, geom.width, geom.height)

    const query = String(properties.get('--sql-query'))
    const db = await SqlDB.db()
    const result = db.exec(query);

    console.log(query)
    console.log(result[0].values.join(', '))

  }
}

registerPaint('sql-db', SqlDB)