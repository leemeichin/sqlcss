import initSqlJs from './sql-asm.js'
import font from './font.js'

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
      ['Jeremy Beadle', 'The Fresh Prince of Bel Air', 'Einstein', 'Noel Edmonds']
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

    // console.log(font)
    // console.log(query)
    // console.log(result[0].values.join(', '))

    const queryWidth = font.getAdvanceWidth(query, 48)
    console.log(geom.width, queryWidth)
    const queryPath = font.getPath(query, (geom.width / 2) - (queryWidth / 2), geom.height / 2, 48)
    queryPath.fill = '#fdfdfd'
    queryPath.draw(ctx)

    const results = result[0].values.join('; ')
    const resultsWidth = font.getAdvanceWidth(results, 48)
    const resultsPath = font.getPath(results, (geom.width / 2) - (resultsWidth / 2), geom.height / 2 + 64, 48)
    
    resultsPath.fill = '#f8f8f8'
    resultsPath.stroke = '#050505'
    resultsPath.strokeWidth = 1
    resultsPath.draw(ctx)
  }
}

registerPaint('sql-db', SqlDB)