import base64 from 'https://ga.jspm.io/npm:base64-js@1.5.1/index.js'
import initSqlJs from './sql-asm.js'
import font from './font.js'


class SqlCss {
  static _db;

  static get inputProperties() {
    return [
      '--sql-query',
      '--sql-database',
    ]
  }

  static async SQL() {
    if (SqlCss._SQL) {
      return SqlCss._SQL;
    }

    SqlCss._SQL = await initSqlJs({
      locateFile: file => `./${file}`,
    });

    return SqlCss._SQL;
  }

  async db(properties) {
    const base64String = String(properties.get('--sql-database')).split('base64,')[1].slice(0, -2);
    const schema = base64.toByteArray(base64String);

    this._db = new (await SqlCss.SQL()).Database(schema);
    return this._db;
  }

  async drawQueryAndResult(ctx, geom, properties) {
    const db = await this.db(properties);

    const query = String(properties.get('--sql-query'))
    console.log(query)

    try {
      const result = db.exec(query);

      const results = result[0].values.join('; ')
      const resultsWidth = font.getAdvanceWidth(results, 48)
      const resultsPath = font.getPath(results, (geom.width / 2) - (resultsWidth / 2), geom.height / 2 + 64, 48)

      resultsPath.fill = '#f8f8f8'
      resultsPath.stroke = '#050505'
      resultsPath.strokeWidth = 1
      resultsPath.draw(ctx)
    } catch (err) {
      const errorWidth = font.getAdvanceWidth(err.message, 32)
      const errorPath = font.getPath(err.message, (geom.width / 2) - (errorWidth / 2), geom.height / 2, 32)
      errorPath.draw(ctx);
    }
  }

  drawIntro(ctx, geom, properties) {
    if (properties.get('--sql-database').length === 0) {
      let text = 'set up a database!'
      let textWidth = font.getAdvanceWidth(text, 48)
      let textPath = font.getPath(text, (geom.width / 2) - (textWidth / 2), geom.height / 2, 48)

      textPath.fill = '#f8f8f8'
      textPath.draw(ctx)
    } else if (properties.get('--sql-database').length && properties.get('--sql-query').length === 0) {
      let text = 'now write a query!'
      let textWidth = font.getAdvanceWidth(text, 48)
      let textPath = font.getPath(text, (geom.width / 2) - (textWidth / 2), geom.height / 2, 48)

      textPath.fill = '#f8f8f8'
      textPath.draw(ctx)
    }
  }

  async paint(ctx, geom, properties) {
    const gradient = ctx.createLinearGradient(0, 300, geom.width, geom.height)
    gradient.addColorStop(0, '#dd3e54')
    gradient.addColorStop(1, '#6be585')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, geom.width, geom.height)

    if (properties.get('--sql-query').length && properties.get('--sql-database').length) {
      await this.drawQueryAndResult(ctx, geom, properties);
    } else {
      this.drawIntro(ctx, geom, properties);
    }
  }
}

registerPaint('sql-css', SqlCss)