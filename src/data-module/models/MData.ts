import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import DOperation from '../dtos/DOperation';
import { Pool } from 'pg';
import DResponse from '../dtos/DResponse';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

@Injectable()
export class MData {
    dbProvider: any;

    contextClass = "MData - ";

    constructor(private configService: ConfigService) {
    }

    //ENV variables
    db_connection = this.configService.get<string>('DB_CONNECTION');

    /**
     * 
     * @param operation 
     * @returns 
     */
    async Query(operation: DOperation) {

        let connection = JSON.parse(this.db_connection);

        if (connection[operation.apiKey]) {

            this.buildConnection(connection[operation.apiKey]);
            let from = "";
            if (operation.table != "") {
                from = " from " + operation.table;
            }
            if (!operation.fields) {
                return new DResponse("", [], "field required", "");
            }
            try {
                let rows;
                let query;
                operation.modifier = operation.modifier ? operation.modifier : '';
                if (!operation.condition) {
                    query = "select " + operation.fields + from + " " + operation.modifier;
                }
                else {
                    query = "select " + operation.fields + from + " where " + operation.condition + " " + operation.modifier;
                }
                const dbQuery = await this.dbProvider.useValue.query(query);
                rows = dbQuery.rows;

                this.IteratorRows(rows, connection, operation);

                return new DResponse("Consulta exitosa", rows, "", "");

            }
            catch (error) {

                return new DResponse("Error en la consulta", [], error.message, "");
            }

        } else {
            return new DResponse("Error en la consulta", [], "", "apiKey not found");
        }
    }

    IteratorRows(rows, connection, operation) {
        for (let row of rows) {
            for (let field in row) {
                try {
                    if (row[field].constructor == Array || row[field].constructor == Object) {
                        row[field] = JSON.stringify(row[field]);
                    } else if (row[field].constructor == Date) {
                        let dateFormat = row[field];
                        if (connection[operation.apiKey]['timezone']) {
                            dateFormat = utcToZonedTime(row[field], connection[operation.apiKey]['timezone']);
                        }
                        row[field] = format(dateFormat, 'yyyy-MM-dd HH:mm:ss');
                    }
                } catch (error) {

                }

            }
        }

        return rows;
    }

    /**
     * 
     * @param operation 
     * @returns 
     */
    async Add(operation: DOperation) {

        let connection = JSON.parse(this.db_connection);

        if (connection[operation.apiKey]) {

            this.buildConnection(connection[operation.apiKey]);

            if (!operation.table) {
                return new DResponse("", [], "table required", "");
            }

            try {
                let query = this.CreateQueryAdd(operation);

                const dbQuery = await this.dbProvider.useValue.query(query);

                let valueReturn = "";
                if (operation.returning && dbQuery.rows?.[0]) {
                    valueReturn = dbQuery.rows[0][operation.returning];
                }

                return new DResponse("Adición con exito", [], valueReturn, "");
            }
            catch (error) {
                return new DResponse("Error en la adición", [], "", error.message);
            }

        } else {
            return new DResponse("Error en la adición", [], "", "apiKey not found");
        }
    }

    /**
     * 
     * @param operation 
     * @returns 
     */
    CreateQueryAdd(operation: DOperation) {
        let query = '';
        try {
            if (!operation.fields && !operation.values) {

                query = "Insert into " + operation.table;
            }
            else if (!operation.fields && operation.values) {
                query = "Insert into " + operation.table + " values(" + operation.values + ")";
            }
            else {
                if (!operation.returning) {
                    query = "Insert into " + operation.table + " (" + operation.fields + ") values(" + operation.values + ")";
                }
                else {
                    query = "Insert into " + operation.table + " (" + operation.fields + ") values(" + operation.values + ") returning " + operation.returning;
                }
            }
        } catch (error) {
            query = '';
        }

        return query;
    }

    /**
     * 
     * @param operation 
     * @returns 
     */
    async Edit(operation: DOperation) {

        let connection = JSON.parse(this.db_connection);

        if (connection[operation.apiKey]) {

            this.buildConnection(connection[operation.apiKey]);

            if (!operation.condition || !operation.table || !operation.fields) {
                return new DResponse("", [], "condition, table or fields required", "");
            }

            try {
                let query = "update " + operation.table + " set " + operation.fields + " where " + operation.condition;

                if (operation.returning) {
                    query += " returning " + operation.returning;
                }

                console.log(query)
                const dbQuery = await this.dbProvider.useValue.query(query);

                let valueReturn = "";
                if (operation.returning && dbQuery.rows?.[0]) {
                    valueReturn = dbQuery.rows[0][operation.returning];
                }
                return new DResponse("Edición con exito", [], valueReturn, "");
            }
            catch (error) {
                return new DResponse("Error en la edición", [], "", "apiKey not found");
            }

        } else {
            return new DResponse("Error en la edición", [], "", "apiKey not found");
        }
    }

    /**
     * 
     * @param operation 
     * @returns 
     */
    async Delete(operation: DOperation) {

        let connection = JSON.parse(this.db_connection);

        if (connection[operation.apiKey]) {

            this.buildConnection(connection[operation.apiKey]);
            if (!operation.condition) {
                return new DResponse("", [], "condition required", "");
            }
            if (!operation.table) {
                return new DResponse("", [], "table required", "");
            }

            try {
                let query = "delete from  " + operation.table + "  where " + operation.condition;
                const dbQuery = await this.dbProvider.useValue.query(query);

                let valueReturn = "";
                if (operation.returning && dbQuery.rows?.[0]) {
                    valueReturn = dbQuery.rows[0][operation.returning];
                }
                return new DResponse("Eliminado con exito", [], valueReturn, "");
            }

            catch (error) {
                return new DResponse("Error en la eliminación", [], "", error.message);
            }

        } else {
            return new DResponse("Error en la eliminación", [], "", "apiKey not found");
        }
    }

    /**
     * 
     * @param connection 
     */
    buildConnection(connection) {
        this.dbProvider = {
            provide: 'pgConnection',
            useValue: new Pool({
                user: connection.user,
                host: connection.host,
                database: connection.database,
                password: connection.password,
                port: connection.port,
            }),
        };
    }
}
