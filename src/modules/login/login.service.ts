import { Injectable } from '@nestjs/common';
import { DataReturn } from 'src/utilities/interfaces/data-return-interface';
import { RegisterDto } from '../register/dto/register.dto';
import { UserLogin } from './dto/user-login.dto';
import { QueryService } from '../query/query-service';
import SelectDto from '../query/dto/select.dto';
import { JwtService } from '@nestjs/jwt';
import InsertDto from '../query/dto/insert.dto';
import { UserRegister } from './dto/user-register.dto';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    private queryService: QueryService,
  ) {}

  async login(dto: UserLogin) {
    const dataReturn: DataReturn = { response: true, data: '', error: '' };
    try {
      const res = await this.validateUserCredentials(dto);
      if (res?.response) {
        const token = await this.getToken(dto);
        dataReturn.data = { token };
        return dataReturn;
      } else {
        return res;
      }
    } catch (e) {
      dataReturn.response = false;
      dataReturn.error = e;
      return dataReturn;
    }
  }

  async validateUserCredentials(dto: UserLogin) {
    const dataReturn: DataReturn = {
      response: true,
      data: null,
      error: '',
    };

    try {
      const operation: SelectDto = {
        fields: 'name',
        table: 'str_admin.tbl_user',
        condition: `email = '${dto.email
          .toLowerCase()
          .trim()}' AND password = '${dto.password}'`,
        modifier: '',
      };
      const responseBd = await this.queryService.select(operation);
      if (responseBd && responseBd.response && responseBd.result.length) {
        const name = responseBd.result[0].name;
        dataReturn.data = { email: dto.email, password: dto.password, name };
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

  async getToken(payload: any) {
    const jwtOptions = {
      secret: process.env.JWT_SECRET,
    };

    return this.jwtService.signAsync(payload, jwtOptions);
  }

  async signUp(dto: UserRegister) {
    const dataReturn: DataReturn = { response: true, data: '', error: '' };
    try {
      const operation: InsertDto = {
        fields: `email, name, password`,
        values: `'${dto.email.toLowerCase().trim()}', '${dto.name}', '${
          dto.password
        }'`,
        table: 'str_admin.tbl_user',
        returning: '',
      };
      const responseBd = await this.queryService.insert(operation);
      if (responseBd && responseBd.response) {
        const token = await this.getToken(dto);
        dataReturn.data = { token };
        return dataReturn;
      } else {
        dataReturn.response = false;
        if (
          responseBd.error &&
          responseBd.error.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          dataReturn.error =
            'Mmm parece que ya existe una cuenta con este correo';
        } else {
          dataReturn.error = 'Error desconocido';
        }
      }
      return dataReturn;
    } catch (error) {
      dataReturn['error'] = error;
      return dataReturn;
    }
  }
}

export interface Payload {
  email: string;
  name: string;
}
