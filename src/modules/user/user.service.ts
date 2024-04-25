import { Injectable } from '@nestjs/common';
import { DataReturn } from 'src/utilities/interfaces/data-return-interface';
import { QueryService } from '../query/query-service';
import SelectDto from '../query/dto/select.dto';
import DeleteDto from '../query/dto/delete.dto';
import { UserDto } from './dto/user-login.dto';
import UpdateDto from '../query/dto/update.dto';

@Injectable()
export class UserService {
  constructor(private queryService: QueryService) {}

  /**
   * @description Method that consults all users.
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
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
      if (responseBd && responseBd.response) {
        dataReturn.data = responseBd.result;
      } else {
        dataReturn['error'] =
          'Lo sentimos, ocurrió un error, comunícate con tu proveedor';
        dataReturn['response'] = false;
      }
      return dataReturn;
    } catch (e) {
      console.log(e);
      dataReturn['response'] = false;
      dataReturn['error'] = e;
      return dataReturn;
    }
  }

  /**
   * @description Method that edit the name of the user
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
  async editUser(id: string, dto: UserDto) {
    const dataReturn: DataReturn = {
      response: true,
      data: null,
      error: '',
    };

    try {
      const operation: UpdateDto = {
        table: 'str_admin.tbl_user',
        fields: `name = '${dto.name}'`,
        condition: `email = '${id}'`,
        returning: '',
      };
      const responseBd = await this.queryService.update(operation);
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
      console.log(e);
      dataReturn['response'] = false;
      dataReturn['error'] = e;
      return dataReturn;
    }
  }

  /**
   * @description Method that delete a user by the id(email)
   * @param {type} parameter
   * @author David Pérez
   * @date 21/04/2024
   * @returns {type}
   */
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
      console.log(e);
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
