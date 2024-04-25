import { Injectable } from '@nestjs/common';
import DOperation, { InsertDto } from './dto/insert.dto';
import { Pool } from 'pg';
import DResponse from './dto/response.dto';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import SelectDto from './dto/select.dto';
import { UpdateDto } from './dto/update.dto';
import DeleteDto from './dto/delete.dto';

@Injectable()
export class QueryService {
  //ENV variables
  dbConnection: any;
  dbProvider: any;

  constructor() {
    this.dbConnection = JSON.parse(process.env.DB_CONNECTION);
    this.buildConnection(this.dbConnection['production']);
  }

  /**
   * @description Method that performs the execution of an select transaction in db
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  async select(dto: SelectDto) {
    try {
      let rows;
      let query;

      if (!dto.table) {
        return new DResponse('', [], 'table required', '');
      }

      if (!dto.fields) {
        return new DResponse('', [], 'fields required', '');
      }

      query = `select ${dto.fields} from ${dto.table} ${
        dto.condition ? ' where ' + dto.condition : ''
      } ${dto.modifier ? dto.modifier : ''}`;

      const queryTransaction = await this.dbProvider.pool.query(query);
      rows = queryTransaction.rows;
      this.iteratorRows(rows, this.dbConnection, dto);
      return new DResponse(true, rows, '', '');
    } catch (error) {
      return new DResponse(false, [], '', error.message);
    }
  }

  /**
   * @description Method that performs the execution of an insert transaction in db
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  async insert(operation: InsertDto) {
    if (!operation.table) {
      return new DResponse('', [], 'table required', '');
    }
    try {
      let returning = '';
      let query = this.buildInsert(operation);

      const queryTransaction = await this.dbProvider.pool.query(query);
      if (operation.returning && queryTransaction.rows?.[0]) {
        returning = queryTransaction.rows[0][operation.returning];
      }

      return new DResponse(true, [], returning, '');
    } catch (error) {
      return new DResponse(false, [], '', error.message);
    }
  }

  /**
   * @description Method that performs the execution of an update transaction in db
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  async update(operation: UpdateDto) {
    if (!operation.condition || !operation.table || !operation.fields) {
      return new DResponse('', [], 'condition, table or fields required', '');
    }

    try {
      let query =
        'update ' +
        operation.table +
        ' set ' +
        operation.fields +
        ' where ' +
        operation.condition;

      if (operation.returning) {
        query += ' returning ' + operation.returning;
      }

      console.log(query);
      const dbQuery = await this.dbProvider.pool.query(query);

      let valueReturn = '';
      if (operation.returning && dbQuery.rows?.[0]) {
        valueReturn = dbQuery.rows[0][operation.returning];
      }
      return new DResponse('Edición con exito', [], valueReturn, '');
    } catch (error) {
      return new DResponse('Error en la edición', [], '', 'apiKey not found');
    }
  }

  /**
   * @description Method that performs the execution of an delete transaction in db
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  async delete(operation: DeleteDto) {
    if (!operation.condition) {
      return new DResponse('', [], 'condition required', '');
    }
    if (!operation.table) {
      return new DResponse('', [], 'table required', '');
    }

    try {
      let returning = '';
      let query =
        'delete from  ' + operation.table + '  where ' + operation.condition;
      const queryTransaction = await this.dbProvider.pool.query(query);

      if (operation.returning && queryTransaction.rows?.[0]) {
        returning = queryTransaction.rows[0][operation.returning];
      } else {
        return new DResponse(
          'Error al eliminar',
          [],
          returning,
          queryTransaction.error,
        );
      }
      return new DResponse('Eliminado con exito', [], returning, '');
    } catch (error) {
      return new DResponse('Error en la eliminación', [], '', error.message);
    }
  }

  /**
   * @description Method that verify rows type date
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  iteratorRows(rows, connection, operation) {
    for (let row of rows) {
      for (let field in row) {
        try {
          if (
            row[field].constructor == Array ||
            row[field].constructor == Object
          ) {
            row[field] = JSON.stringify(row[field]);
          } else if (row[field].constructor == Date) {
            let dateFormat = row[field];
            if (connection[operation.apiKey]['timezone']) {
              dateFormat = utcToZonedTime(
                row[field],
                connection[operation.apiKey]['timezone'],
              );
            }
            row[field] = format(dateFormat, 'yyyy-MM-dd HH:mm:ss');
          }
        } catch (error) {}
      }
    }

    return rows;
  }

  /**
   * @description Method that constructs the insert statement
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  buildInsert(operation: DOperation) {
    let query = '';
    try {
      if (!operation.fields && !operation.values) {
        query = 'Insert into ' + operation.table;
      } else if (!operation.fields && operation.values) {
        query =
          'Insert into ' +
          operation.table +
          ' values(' +
          operation.values +
          ')';
      } else {
        if (!operation.returning) {
          query =
            'Insert into ' +
            operation.table +
            ' (' +
            operation.fields +
            ') values(' +
            operation.values +
            ')';
        } else {
          query =
            'Insert into ' +
            operation.table +
            ' (' +
            operation.fields +
            ') values(' +
            operation.values +
            ') returning ' +
            operation.returning;
        }
      }
    } catch (error) {
      query = '';
    }

    return query;
  }

  /**
   * @description Method that create connection con db postgresql
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  buildConnection(connection) {
    this.dbProvider = {
      provide: 'pgConnection',
      pool: new Pool({
        user: connection.user,
        host: connection.host,
        database: connection.database,
        password: connection.password,
        port: connection.port,
      }),
    };
  }
}
