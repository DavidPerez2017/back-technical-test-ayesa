import { Injectable } from '@nestjs/common';
import { DataReturn } from 'src/utilities/interfaces/data-return-interface';
import { QueryService } from '../query/query-service';
import SelectDto from '../query/dto/select.dto';
import DeleteDto from '../query/dto/delete.dto';

@Injectable()
export class UserService {
  constructor(private queryService: QueryService) {}

  async getAllUsers() {
    const dataReturn: DataReturn = {
      response: true,
      data: null,
      error: '',
    };

    try {
      const operation: SelectDto = {
        fields: 'email, name',
        table: 'str_admin.tbl_user',
        condition: ``,
        modifier: '',
      };
      const responseBd = await this.queryService.select(operation);
      if (responseBd && responseBd.response && responseBd.result.length) {
        dataReturn.data = responseBd.result;
        return dataReturn;
      } else {
        if (responseBd.error) {
          dataReturn['error'] =
            'Lo sentimos, ocurrió un error, comunícate con tu proveedor';
          dataReturn['response'] = false;
        } else {
          dataReturn['response'] = false;
          dataReturn['error'] = 'Usuario y/o Contraseña incorrecta.';
        }
        return dataReturn;
      }
    } catch (e) {
      dataReturn['response'] = false;
      dataReturn['error'] = e;
      return dataReturn;
    }
  }

  async deleteUser(id: string) {
    const dataReturn: DataReturn = {
      response: true,
      data: null,
      error: '',
    };

    try {
      const operation: DeleteDto = {
        table: 'str_admin.tbl_user',
        condition: `email = '${id}'`,
        returning: '',
      };
      const responseBd = await this.queryService.delete(operation);
      if (responseBd && responseBd.response) {
        dataReturn.data = responseBd.result;
        return dataReturn;
      } else {
        if (responseBd.error) {
          dataReturn['error'] =
            'Lo sentimos, ocurrió un error, comunícate con tu proveedor';
          dataReturn['response'] = false;
        }
        return dataReturn;
      }
    } catch (e) {
      dataReturn['response'] = false;
      dataReturn['error'] = e;
      return dataReturn;
    }
  }
}

export interface Payload {
  email: string;
  name: string;
}
